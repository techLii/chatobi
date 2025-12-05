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
        <LeaderboardClient constituency={constituency} />
    );
}
