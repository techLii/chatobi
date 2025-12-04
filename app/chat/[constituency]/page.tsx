import { constituencies } from '@/config/constituencies';
import { notFound } from 'next/navigation';
import ChatClient from '@/components/ChatClient';

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
            <header className="mb-6 border-b border-black pb-2 flex justify-between items-baseline">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-wider">#{constituencyData.name}</h1>
                    <p className="text-xs text-gray-500">CONSTITUENCY CHAT</p>
                </div>
                <div className="flex gap-4">
                    <a href={`/chat/${constituency}/leaderboard`} className="text-sm underline hover:no-underline">Leaderboard</a>
                    <a href={`/chat/${constituency}/trending`} className="text-sm underline hover:no-underline">Trending</a>
                    <a href={`/chat/${constituency}/events`} className="text-sm underline hover:no-underline">Events</a>
                </div>
            </header>

            <ChatClient constituency={constituency} />
        </div>
    );
}
