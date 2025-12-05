import { constituencies } from '@/config/constituencies';
import { notFound } from 'next/navigation';
import TrendingClient from '@/components/TrendingClient';

interface PageProps {
    params: Promise<{ constituency: string }>;
}

export default async function TrendingPage({ params }: PageProps) {
    const { constituency } = await params;
    const constituencyData = constituencies.find((c) => c.id === constituency);

    if (!constituencyData) {
        notFound();
    }

    return (
        <TrendingClient constituency={constituency} />
    );
}
