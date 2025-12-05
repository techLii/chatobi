import { constituencies } from '@/config/constituencies';
import { notFound } from 'next/navigation';
import UserControls from '@/components/UserControls';
import Marketplace from '@/components/Marketplace';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ constituency: string }>;
}

export default async function ConstituencyLayout({ children, params }: LayoutProps) {
    const { constituency } = await params;
    const constituencyData = constituencies.find((c) => c.id === constituency);

    if (!constituencyData) {
        notFound();
    }

    return (
        <div className="p-2 w-full font-mono grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
            {/* Left Column: Marketplace */}
            <div className="lg:col-span-1 hidden lg:block">
                <Marketplace />
            </div>

            {/* Right Column: Content */}
            <div className="lg:col-span-3 flex flex-col h-full">
                <header className="mb-2 border-b border-black dark:border-gray-700 pb-2 flex flex-col md:flex-row justify-between items-start md:items-baseline gap-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold uppercase tracking-wider text-black dark:text-white">#{constituencyData.name}</h1>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">CONSTITUENCY CHAT</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex gap-4">
                            <a href={`/dashboard/chat/${constituency}`} className="text-sm underline hover:no-underline text-black dark:text-white">Chat</a>
                            <a href={`/dashboard/chat/${constituency}/leaderboard`} className="text-sm underline hover:no-underline text-black dark:text-white">Leaderboard</a>
                            <a href={`/dashboard/chat/${constituency}/trending`} className="text-sm underline hover:no-underline text-black dark:text-white">Trending</a>
                            <a href={`/dashboard/chat/${constituency}/events`} className="text-sm underline hover:no-underline text-black dark:text-white">Events</a>
                        </div>
                        <UserControls />
                    </div>
                </header>

                <div className="flex-1 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}
