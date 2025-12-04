'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const { user, logout, loading } = useAuth();
    const pathname = usePathname();

    if (loading) return null;

    return (
        <header className="border-b border-black bg-white font-mono sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold uppercase tracking-wider hover:underline">
                        Chatobi
                    </Link>

                    {/* App Routes */}
                    <nav className="hidden md:flex gap-6">
                        <Link
                            href="/"
                            className={`text-sm uppercase tracking-wide hover:underline ${pathname === '/' ? 'font-bold' : ''}`}
                        >
                            Home
                        </Link>
                        {/* We can add more global routes here as the app grows */}
                    </nav>
                </div>

                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            <Link href="/profile" className="text-sm hover:underline flex items-center gap-2 group">
                                <span className="group-hover:scale-110 transition-transform">👤</span>
                                <span className="font-bold">{user.name}</span>
                            </Link>
                            <button
                                onClick={logout}
                                className="text-xs border border-black px-3 py-1 hover:bg-black hover:text-white uppercase tracking-wide transition-colors flex items-center gap-1"
                                title="Logout"
                            >
                                <span>Logout</span>
                                <span className="text-[10px]">⏻</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm hover:underline uppercase tracking-wide"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm bg-black text-white px-3 py-1 hover:bg-gray-800 uppercase tracking-wide"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
