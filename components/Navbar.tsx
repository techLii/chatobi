'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
    const { user, logout, loading } = useAuth();

    if (loading) return null;

    return (
        <nav className="border-b border-black bg-white font-mono">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="text-xl font-bold uppercase tracking-wider hover:underline">
                    Chatobi
                </Link>

                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            <span className="text-sm">
                                👤 <span className="font-bold">{user.name}</span>
                            </span>
                            <button
                                onClick={logout}
                                className="text-sm border border-black px-3 py-1 hover:bg-black hover:text-white uppercase tracking-wide"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm border border-black px-3 py-1 hover:bg-black hover:text-white uppercase tracking-wide"
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
