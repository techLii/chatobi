'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { constituencies } from '@/config/constituencies';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-black text-white rounded-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar Container */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-black transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:relative md:translate-x-0`}
            >
                <div className="p-4 border-b border-black h-16 flex items-center">
                    <h2 className="text-xl font-bold uppercase tracking-wider">Constituencies</h2>
                </div>

                <nav className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
                    <ul className="space-y-2">
                        {constituencies.map((c) => (
                            <li key={c.id}>
                                <Link
                                    href={`/dashboard/chat/${c.id}`}
                                    className={`block p-2 text-sm hover:bg-gray-100 rounded ${pathname?.includes(`/chat/${c.id}`) ? 'bg-black text-white font-bold' : 'text-black'
                                        }`}
                                    onClick={() => setIsOpen(false)} // Close on mobile selection
                                >
                                    {c.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
