'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function UserControls() {
    const { user, logout, loading } = useAuth();

    if (loading) return null;

    return (
        <div className="flex gap-4 items-center text-sm mt-2">
            {user ? (
                <>
                    <Link href="/profile" className="hover:underline flex items-center gap-1 group text-black dark:text-white">
                        <span className="group-hover:scale-110 transition-transform">👤</span>
                        <span className="font-bold">{user.name}</span>
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <button
                        onClick={logout}
                        className="hover:underline text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white uppercase tracking-wide"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link
                        href="/login"
                        className="hover:underline uppercase tracking-wide text-black dark:text-white"
                    >
                        Login
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <Link
                        href="/signup"
                        className="hover:underline uppercase tracking-wide text-black dark:text-white"
                    >
                        Sign Up
                    </Link>
                </>
            )}
        </div>
    );
}
