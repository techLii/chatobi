'use client';

import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, CHAT_COLLECTION_ID } from '@/lib/appwrite';
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
}

export default function ChatClient({ constituency }: { constituency: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();

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
            }
        );

        return () => {
            unsubscribe();
        };
    }, [constituency]);

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
                    constituency: constituency
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
                    messages.map((msg) => (
                        <div key={msg.$id} className="border-b border-gray-300 pb-2">
                            <div className="flex justify-between items-baseline mb-1">
                                <Link
                                    href={`/dm/${msg.userId}`}
                                    className="font-bold text-sm text-black hover:underline cursor-pointer"
                                    title={`Send DM to ${msg.username}`}
                                >
                                    {msg.username} 💬
                                </Link>
                                <span className="text-xs text-gray-500">
                                    {new Date(msg.$createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                            <p className="text-sm text-black">{msg.body}</p>
                        </div>
                    ))
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
