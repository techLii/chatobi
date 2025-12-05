'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const pathname = usePathname();

    // Optional: Hide navbar on dashboard if desired, but user asked for a navbar.
    // Let's keep it visible but maybe simplify it or ensure it doesn't conflict.
    // If we are on dashboard, the sidebar handles navigation.
    // But a top navbar is still useful for "Home" or "Logout".

    if (loading) return null;

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-black dark:border-gray-700 font-mono transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold uppercase tracking-wider hover:underline text-black dark:text-white">
                    Chatobi
                </Link>

                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className={`text-sm hover:underline uppercase tracking-wide ${pathname?.startsWith('/dashboard') ? 'font-bold' : ''}`}
                            >
                                Dashboard
                            </Link>
                            <span className="text-gray-300">|</span>
                            <button
                                onClick={logout}
                                className="text-sm hover:underline uppercase tracking-wide"
                            >
                                Logout
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
        </nav>
    );
}
