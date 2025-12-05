'use client';

import { useEffect, useState } from 'react';
import { databases, DATABASE_ID, CHAT_COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface Message {
    $id: string;
    userId: string;
    username: string;
    body: string;
    $createdAt: string;
    upvotes?: string[];
    downvotes?: string[];
}

interface TrendingMessage extends Message {
    score: number;
}

export default function TrendingClient({ constituency }: { constituency: string }) {
    const [trendingMessages, setTrendingMessages] = useState<TrendingMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Fetch recent messages to find trending ones.
                // Ideally, we'd have a backend function to sort by array length, but Appwrite doesn't support sorting by array length directly in queries yet easily without an attribute.
                // So we fetch recent active messages and sort client side.
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    CHAT_COLLECTION_ID,
                    [
                        Query.equal('constituency', constituency),
                        Query.limit(100),
                        Query.orderDesc('$createdAt')
                    ]
                );

                const messagesWithScore = response.documents.map((doc) => {
                    const upvotes = doc.upvotes || [];
                    const downvotes = doc.downvotes || [];
                    const score = (upvotes.length || 0) - (downvotes.length || 0);
                    return {
                        ...doc,
                        score
                    } as unknown as TrendingMessage;
                });

                // Filter for positive score and sort by score descending
                const sortedTrending = messagesWithScore
                    .filter(msg => msg.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 20);

                setTrendingMessages(sortedTrending);
            } catch (error) {
                console.error('Error fetching trending messages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, [constituency]);

    if (loading) {
        return <div className="p-4 text-center text-gray-500 animate-pulse">Loading trending posts...</div>;
    }

    if (trendingMessages.length === 0) {
        return (
            <div className="text-center p-8 border border-black border-dashed text-gray-500">
                No trending posts yet. Be the first to create a buzz!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {trendingMessages.map((msg, index) => (
                <div
                    key={msg.$id}
                    className="border border-black dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-all"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm bg-black dark:bg-white text-white dark:text-black px-2 py-0.5">
                                #{index + 1}
                            </span>
                            <span className="font-bold text-sm text-black dark:text-white">{msg.username}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(msg.$createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded border border-green-200 dark:border-green-800">
                            <span className="text-green-700 dark:text-green-400 font-bold">▲ {msg.score}</span>
                        </div>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{msg.body}</p>
                </div>
            ))}
        </div>
    );
}
