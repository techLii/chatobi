'use client';

import { useEffect, useState } from 'react';
import { databases, DATABASE_ID, CHAT_COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface Leader {
    userId: string;
    username: string;
    score: number;
}

export default function LeaderboardClient({ constituency }: { constituency: string }) {
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // Fetch messages for this constituency (or all if we want global, but let's stick to constituency context as per route)
                // We need to fetch enough messages to get a good sample. 
                // Note: In a real production app with millions of messages, this aggregation should happen server-side or via an Appwrite Function.
                // For now, we'll fetch the most recent 5000 messages (or max allowed per request is usually 100, so we might need to paginate or just take the last 100).
                // Let's try to fetch a reasonable amount. Appwrite limit is 100 per request.

                // We'll fetch the last 500 messages for now to keep it responsive.
                // TODO: Implement pagination for full history aggregation.
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    CHAT_COLLECTION_ID,
                    [
                        Query.equal('constituency', constituency),
                        Query.limit(100), // Fetching 100 for now. 
                        Query.orderDesc('$createdAt')
                    ]
                );

                const userScores: Record<string, { username: string; score: number }> = {};

                response.documents.forEach((doc) => {
                    const upvotes = doc.upvotes || [];
                    const downvotes = doc.downvotes || []; // Assuming downvotes exist based on previous context, though not explicitly in schema check, but seen in grep.
                    // If downvotes don't exist in schema yet, we'll just ignore.

                    // Check if 'upvotes' is an array of strings (userIds)
                    const score = (upvotes.length || 0) - (downvotes.length || 0);

                    if (score > 0) {
                        const userId = doc.userId;
                        const username = doc.username || 'Anonymous';

                        if (!userScores[userId]) {
                            userScores[userId] = { username, score: 0 };
                        }
                        userScores[userId].score += score;
                    }
                });

                const sortedLeaders = Object.entries(userScores)
                    .map(([userId, data]) => ({
                        userId,
                        username: data.username,
                        score: data.score
                    }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10);

                setLeaders(sortedLeaders);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [constituency]);

    if (loading) {
        return <div className="p-4 text-center text-gray-500 animate-pulse">Loading leaderboard...</div>;
    }

    if (leaders.length === 0) {
        return (
            <div className="text-center p-8 border border-black border-dashed text-gray-500">
                No data available yet. Start chatting and upvoting!
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {leaders.map((leader, index) => (
                <div
                    key={leader.userId}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-black ${index === 0 ? 'bg-yellow-50' : 'bg-white'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <span className={`font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full border border-black ${index === 0 ? 'bg-yellow-400 text-black' :
                                index === 1 ? 'bg-gray-300 text-black' :
                                    index === 2 ? 'bg-orange-300 text-black' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {index + 1}
                        </span>
                        <div>
                            <p className="font-bold text-lg">{leader.username}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Rank {index + 1}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-black">{leader.score}</span>
                        <span className="text-xs text-gray-500 uppercase">Points</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
