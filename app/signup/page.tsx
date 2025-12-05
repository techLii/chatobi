'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(email, password, name);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-mono">
            <div className="max-w-md w-full border border-black dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg">
                <h1 className="text-2xl font-bold uppercase tracking-wider mb-6 text-center text-black dark:text-white">Sign Up</h1>

                {error && (
                    <div className="mb-4 p-3 border border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1 text-black dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-black dark:border-gray-600 p-2 rounded-none bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 text-black dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-black dark:border-gray-600 p-2 rounded-none bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 text-black dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-black dark:border-gray-600 p-2 rounded-none bg-white dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                            required
                            minLength={8}
                        />
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Minimum 8 characters</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-2 hover:bg-gray-800 dark:hover:bg-gray-200 uppercase text-sm font-bold tracking-wide disabled:bg-gray-400 dark:disabled:bg-gray-600"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-black dark:text-gray-300">
                    Already have an account?{' '}
                    <Link href="/login" className="underline hover:no-underline font-bold text-black dark:text-white">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
