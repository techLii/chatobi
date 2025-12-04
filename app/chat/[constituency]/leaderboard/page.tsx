import { constituencies } from '@/config/constituencies';
import { notFound } from 'next/navigation';
import LeaderboardClient from '@/components/LeaderboardClient';

interface PageProps {
    params: Promise<{ constituency: string }>;
}

export default async function LeaderboardPage({ params }: PageProps) {
    const { constituency } = await params;
    const constituencyData = constituencies.find((c) => c.id === constituency);

    if (!constituencyData) {
        notFound();
    }

    return (
        <div className="p-4 max-w-2xl mx-auto font-mono">
            <header className="mb-6 border-b border-black pb-2 flex justify-between items-baseline">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-wider">Leaderboard: {constituencyData.name}</h1>
                    <p className="text-xs text-gray-500">TOP CONTRIBUTORS</p>
                </div>
                <a href={`/chat/${constituency}`} className="text-sm underline hover:no-underline">Back to Chat</a>
            </header>

            <LeaderboardClient constituency={constituency} />
        </div>
    );
}
