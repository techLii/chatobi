import { constituencies } from '@/config/constituencies';
import { notFound } from 'next/navigation';
import EventsClient from '@/components/EventsClient';

interface PageProps {
    params: Promise<{ constituency: string }>;
}

export default async function EventsPage({ params }: PageProps) {
    const { constituency } = await params;
    const constituencyData = constituencies.find((c) => c.id === constituency);

    if (!constituencyData) {
        notFound();
    }

    return (
        <div className="p-4 max-w-2xl mx-auto font-mono">
            <header className="mb-6 border-b border-black pb-2 flex justify-between items-baseline">
                <div>
                    <h1 className="text-xl font-bold uppercase tracking-wider">Events: {constituencyData.name}</h1>
                    <p className="text-xs text-gray-500">UPCOMING GATHERINGS</p>
                </div>
                <a href={`/chat/${constituency}`} className="text-sm underline hover:no-underline">Back to Chat</a>
            </header>

            <EventsClient constituency={constituency} />
        </div>
    );
}
