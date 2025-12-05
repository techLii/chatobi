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
        <EventsClient constituency={constituency} />
    );
}
