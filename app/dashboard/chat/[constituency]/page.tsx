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
        <ChatClient constituency={constituency} />
    );
}
