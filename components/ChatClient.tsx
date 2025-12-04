'use client';

import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, CHAT_COLLECTION_ID, PROFILES_COLLECTION_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Message {
    $id: string;
    body: string;
    username: string;
    userId: string;
    constituency: string;
    $createdAt: string;
    upvotes: string[];
    downvotes: string[];
    userAge?: number;
    userSex?: string;
    userLocation?: string;
}

interface Profile {
    age?: number;
    sex?: string;
    location?: string;
}

export default function ChatClient({ constituency }: { constituency: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<Profile | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    PROFILES_COLLECTION_ID,
                    [
                        Query.equal('userId', user.$id),
                        Query.limit(1)
                    ]
                );
                if (response.documents.length > 0) {
                    setUserProfile(response.documents[0] as unknown as Profile);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [user]);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    CHAT_COLLECTION_ID,
                    [
                        Query.equal('constituency', constituency),
                        Query.orderDesc('$createdAt'),
                        Query.limit(50)
                    ]
                );
                setMessages(response.documents.reverse() as unknown as Message[]);
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        };

        loadMessages();

        const unsubscribe = databases.client.subscribe(
            `databases.${DATABASE_ID}.collections.${CHAT_COLLECTION_ID}.documents`,
            (response) => {
                if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                    const payload = response.payload as Message;
                    if (payload.constituency === constituency) {
                        setMessages((prev) => [...prev, payload]);
                    }
                }
                if (response.events.includes('databases.*.collections.*.documents.*.update')) {
                    const payload = response.payload as Message;
                    if (payload.constituency === constituency) {
                        setMessages((prev) => prev.map(msg => msg.$id === payload.$id ? payload : msg));
                    }
                }
            }
        );

        return () => {
            unsubscribe();
        };
    }, [constituency]);

    const handleVote = async (message: Message, type: 'up' | 'down') => {
        if (!user) return;

        const userId = user.$id;
        let upvotes = message.upvotes || [];
        let downvotes = message.downvotes || [];

        const hasUpvoted = upvotes.includes(userId);
        const hasDownvoted = downvotes.includes(userId);

        if (type === 'up') {
            if (hasUpvoted) {
                upvotes = upvotes.filter(id => id !== userId);
            } else {
                upvotes = [...upvotes, userId];
                if (hasDownvoted) {
                    downvotes = downvotes.filter(id => id !== userId);
                }
            }
        } else {
            if (hasDownvoted) {
                downvotes = downvotes.filter(id => id !== userId);
            } else {
                downvotes = [...downvotes, userId];
                if (hasUpvoted) {
                    upvotes = upvotes.filter(id => id !== userId);
                }
            }
        }

        // Optimistic update
        const updatedMessage = { ...message, upvotes, downvotes };
        setMessages(prev => prev.map(msg => msg.$id === message.$id ? updatedMessage : msg));

        try {
            await databases.updateDocument(
                DATABASE_ID,
                CHAT_COLLECTION_ID,
                message.$id,
                {
                    upvotes,
                    downvotes
                }
            );
        } catch (error) {
            console.error('Error updating vote:', error);
            // Revert on error (optional, but good practice)
            setMessages(prev => prev.map(msg => msg.$id === message.$id ? message : msg));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await databases.createDocument(
                DATABASE_ID,
                CHAT_COLLECTION_ID,
                ID.unique(),
                {
                    body: newMessage,
                    username: user.name,
                    userId: user.$id,
                    constituency: constituency,
                    upvotes: [],
                    downvotes: [],
                    userAge: userProfile?.age || null,
                    userSex: userProfile?.sex || null,
                    userLocation: userProfile?.location || null
                }
            );
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            {!user && (
                <div className="mb-4 p-4 border border-black bg-yellow-50">
                    <p className="text-sm mb-2 text-black">
                        <strong>You must be logged in to post messages.</strong>
                    </p>
                    <Link
                        href="/login"
                        className="inline-block bg-black text-white px-4 py-2 text-sm uppercase tracking-wide hover:bg-gray-800"
                    >
                        Login to Post
                    </Link>
                </div>
            )}

            <div className="space-y-4 mb-6 h-[60vh] overflow-y-auto border border-black p-4 rounded-none bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-gray-400 text-center italic text-sm">-- No messages yet --</div>
                ) : (
                    [...messages]
                        .sort((a, b) => {
                            const scoreA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
                            const scoreB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
                            if (scoreB !== scoreA) return scoreB - scoreA;
                            return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
                        })
                        .map((msg) => {
                            const upvotes = msg.upvotes || [];
                            const downvotes = msg.downvotes || [];
                            const score = upvotes.length - downvotes.length;
                            const hasUpvoted = user && upvotes.includes(user.$id);
                            const hasDownvoted = user && downvotes.includes(user.$id);

                            return (
                                <div key={msg.$id} className="border-b border-gray-300 pb-2 flex gap-3">
                                    <div className="flex flex-col items-center justify-start pt-1 min-w-[24px]">
                                        <button
                                            onClick={() => handleVote(msg, 'up')}
                                            disabled={!user}
                                            className={`text-xs hover:bg-gray-100 p-1 rounded ${hasUpvoted ? 'text-green-600 font-bold' : 'text-gray-400'}`}
                                            title="Upvote"
                                        >
                                            ▲
                                        </button>
                                        <span className={`text-xs font-mono my-1 ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                            {score}
                                        </span>
                                        <button
                                            onClick={() => handleVote(msg, 'down')}
                                            disabled={!user}
                                            className={`text-xs hover:bg-gray-100 p-1 rounded ${hasDownvoted ? 'text-red-600 font-bold' : 'text-gray-400'}`}
                                            title="Downvote"
                                        >
                                            ▼
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                {msg.userId === user?.$id ? (
                                                    <span className="font-bold text-sm text-black">
                                                        {msg.username}
                                                    </span>
                                                ) : (
                                                    <Link
                                                        href={`/dm/${msg.userId}`}
                                                        className="font-bold text-sm text-black hover:underline cursor-pointer"
                                                        title={`Send DM to ${msg.username}`}
                                                    >
                                                        {msg.username} 💬
                                                    </Link>
                                                )}
                                                {(msg.userAge || msg.userSex || msg.userLocation) && (
                                                    <span className="text-xs text-gray-600 font-mono">
                                                        {[
                                                            msg.userAge,
                                                            msg.userSex ? `(${msg.userSex})` : null,
                                                            msg.userLocation
                                                        ].filter(Boolean).join(' ')}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                {new Date(msg.$createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-black">{msg.body}</p>
                                    </div>
                                </div>
                            );
                        })
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={user ? "Type a message..." : "Login to post messages"}
                    disabled={!user}
                    className="flex-1 border border-black p-2 rounded-none bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-200"
                />
                <button
                    type="submit"
                    disabled={!user}
                    className="bg-black text-white px-6 py-2 rounded-none hover:bg-gray-800 uppercase text-sm font-bold tracking-wide disabled:bg-gray-400"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
