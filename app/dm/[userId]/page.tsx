'use client';

import { useState, useEffect } from 'react';
import DMClient from '@/components/DMClient';
import { databases, DATABASE_ID, CHAT_COLLECTION_ID } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface PageProps {
    params: Promise<{ userId: string }>;
}

export default function DMPage({ params }: PageProps) {
    const [userId, setUserId] = useState<string>('');
    const [username, setUsername] = useState<string>('Loading...');

    useEffect(() => {
        params.then(({ userId: id }) => {
            setUserId(id);

            // Fetch username
            databases.listDocuments(
                DATABASE_ID,
                CHAT_COLLECTION_ID,
                [
                    Query.equal('userId', id),
                    Query.limit(1)
                ]
            ).then(response => {
                if (response.documents.length > 0) {
                    setUsername(response.documents[0].username as string);
                } else {
                    setUsername('User');
                }
            }).catch(() => {
                setUsername('User');
            });
        });
    }, [params]);

    if (!userId) return null;

    return (
        <div className="p-4 max-w-2xl mx-auto font-mono">
            <header className="mb-6 border-b border-black pb-2">
                <h1 className="text-xl font-bold uppercase tracking-wider text-gray-500">
                    DM with {username}
                </h1>
                <p className="text-xs text-gray-500">PRIVATE CONVERSATION</p>
            </header>

            <DMClient userId={userId} />
        </div>
    );
}
