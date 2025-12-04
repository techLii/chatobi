'use client';

import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, DMS_COLLECTION_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface DM {
    $id: string;
    text: string;
    fromUser: string;
    toUser: string;
    timestamp: string;
}

export default function DMClient({ userId }: { userId: string }) {
    const [messages, setMessages] = useState<DM[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const loadDMs = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    DMS_COLLECTION_ID,
                    [
                        Query.or([
                            Query.and([
                                Query.equal('fromUser', user.$id),
                                Query.equal('toUser', userId)
                            ]),
                            Query.and([
                                Query.equal('fromUser', userId),
                                Query.equal('toUser', user.$id)
                            ])
                        ]),
                        Query.orderAsc('timestamp'),
                        Query.limit(100)
                    ]
                );
                setMessages(response.documents as unknown as DM[]);
            } catch (error) {
                console.error('Error loading DMs:', error);
            }
        };

        loadDMs();

        const unsubscribe = databases.client.subscribe(
            `databases.${DATABASE_ID}.collections.${DMS_COLLECTION_ID}.documents`,
            (response) => {
                if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                    const payload = response.payload as DM;
                    if (
                        (payload.fromUser === user.$id && payload.toUser === userId) ||
                        (payload.fromUser === userId && payload.toUser === user.$id)
                    ) {
                        setMessages((prev) => [...prev, payload]);
                    }
                }
            }
        );

        return () => {
            unsubscribe();
        };
    }, [userId, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await databases.createDocument(
                DATABASE_ID,
                DMS_COLLECTION_ID,
                ID.unique(),
                {
                    text: newMessage,
                    fromUser: user.$id,
                    toUser: userId,
                    timestamp: new Date().toISOString()
                }
            );
            setNewMessage('');
        } catch (error) {
            console.error('Error sending DM:', error);
        }
    };

    if (!user) {
        return (
            <div className="p-4 border border-black bg-yellow-50">
                <p className="text-sm mb-2 text-black">
                    <strong>You must be logged in to send direct messages.</strong>
                </p>
                <Link
                    href="/login"
                    className="inline-block bg-black text-white px-4 py-2 text-sm uppercase tracking-wide hover:bg-gray-800"
                >
                    Login
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-4 mb-6 h-[60vh] overflow-y-auto border border-black p-4 rounded-none bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-gray-400 text-center italic text-sm">-- Start a conversation --</div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.$id}
                            className={`mb-2 ${msg.fromUser === user.$id ? 'text-right' : 'text-left'}`}
                        >
                            <div
                                className={`inline-block p-2 border border-black rounded-none max-w-[70%] ${msg.fromUser === user.$id ? 'bg-black text-white' : 'bg-white text-black'
                                    }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                                <span className="text-xs opacity-70">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-black p-2 rounded-none bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                    type="submit"
                    className="bg-black text-white px-6 py-2 rounded-none hover:bg-gray-800 uppercase text-sm font-bold tracking-wide"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
