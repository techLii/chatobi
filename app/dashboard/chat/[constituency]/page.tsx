import { constituencies } from '@/config/constituencies';
import { notFound } from 'next/navigation';
import ChatClient from '@/components/ChatClient';
import UserControls from '@/components/UserControls';

interface PageProps {
    params: Promise<{ constituency: string }>;
}

export default async function ChatPage({ params }: PageProps) {
    const { constituency } = await params;
    const constituencyData = constituencies.find((c) => c.id === constituency);

    if (!constituencyData) {
        notFound();
    }

    return (
        <div className="p-4 max-w-2xl mx-auto font-mono">
            <header className="mb-6 border-b border-black pb-2 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-xl font-bold uppercase tracking-wider">#{constituencyData.name}</h1>
                    </div>
                    <p className="text-xs text-gray-500">CONSTITUENCY CHAT</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-4">
                        <a href={`/dashboard/chat/${constituency}/leaderboard`} className="text-sm underline hover:no-underline">Leaderboard</a>
                        <a href={`/dashboard/chat/${constituency}/trending`} className="text-sm underline hover:no-underline">Trending</a>
                        <a href={`/dashboard/chat/${constituency}/events`} className="text-sm underline hover:no-underline">Events</a>
                    </div>
                    <UserControls />
                </div>
            </header>

            <ChatClient constituency={constituency} />
        </div>
    );
}
