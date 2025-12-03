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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-mono">
            <div className="max-w-md w-full border border-black bg-white p-8 shadow-lg">
                <h1 className="text-2xl font-bold uppercase tracking-wider mb-6 text-center text-black">Sign Up</h1>

                {error && (
                    <div className="mb-4 p-3 border border-red-600 bg-red-50 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1 text-black">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-black p-2 rounded-none bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 text-black">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-black p-2 rounded-none bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 text-black">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-black p-2 rounded-none bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
                            required
                            minLength={8}
                        />
                        <p className="text-xs text-gray-600 mt-1">Minimum 8 characters</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2 hover:bg-gray-800 uppercase text-sm font-bold tracking-wide disabled:bg-gray-400"
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-black">
                    Already have an account?{' '}
                    <Link href="/login" className="underline hover:no-underline font-bold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
