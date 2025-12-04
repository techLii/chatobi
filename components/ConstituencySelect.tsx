'use client';

import { useRouter } from 'next/navigation';
import { constituencies } from '@/config/constituencies';

export default function ConstituencySelect({ currentConstituency }: { currentConstituency: string }) {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        if (selectedId) {
            router.push(`/dashboard/chat/${selectedId}`);
        }
    };

    return (
        <div className="relative inline-block">
            <select
                value={currentConstituency}
                onChange={handleChange}
                className="appearance-none bg-white border border-black px-4 py-1 pr-8 text-sm font-bold uppercase tracking-wider cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black max-w-[200px] truncate"
            >
                {constituencies.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    );
}
