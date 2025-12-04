'use client';

import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, PROFILES_COLLECTION_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Profile {
    $id: string;
    userId: string;
    age?: number;
    sex?: string;
    location?: string;
}

export default function ProfileClient() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        age: '',
        sex: '',
        location: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) return;

        const loadProfile = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    PROFILES_COLLECTION_ID,
                    [
                        Query.equal('userId', user.$id),
                        Query.limit(1)
                    ]
                );

                if (response.documents.length > 0) {
                    const profileData = response.documents[0] as unknown as Profile;
                    setProfile(profileData);
                    setFormData({
                        age: profileData.age?.toString() || '',
                        sex: profileData.sex || '',
                        location: profileData.location || ''
                    });
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setMessage('');

        try {
            const data = {
                userId: user.$id,
                age: formData.age ? parseInt(formData.age) : null,
                sex: formData.sex,
                location: formData.location
            };

            if (profile) {
                // Update existing profile
                const response = await databases.updateDocument(
                    DATABASE_ID,
                    PROFILES_COLLECTION_ID,
                    profile.$id,
                    data
                );
                setProfile(response as unknown as Profile);
                setMessage('Profile updated successfully!');
            } else {
                // Create new profile
                const response = await databases.createDocument(
                    DATABASE_ID,
                    PROFILES_COLLECTION_ID,
                    ID.unique(),
                    data
                );
                setProfile(response as unknown as Profile);
                setMessage('Profile created successfully!');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setMessage('Error saving profile. Please try again.');
        }
    };

    if (!user) {
        return (
            <div className="p-4 border border-black bg-yellow-50">
                <p className="text-sm mb-2 text-black">
                    <strong>You must be logged in to view your profile.</strong>
                </p>
                <Link
                    href="/login"
                    className="inline-block bg-black text-white px-4 py-2 text-sm uppercase tracking-wide hover:bg-gray-800"
                >
                    Login
                </Link>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center p-8 text-black">Loading profile...</div>;
    }

    return (
        <div className="max-w-md mx-auto border border-black p-6 bg-white shadow-lg">
            <h2 className="text-xl font-bold uppercase mb-6 text-center border-b border-black pb-2 text-black">
                Edit Profile
            </h2>

            {message && (
                <div className={`mb-4 p-2 text-sm text-center ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1 text-black">Name</label>
                    <input
                        type="text"
                        value={user.name}
                        disabled
                        className="w-full border border-gray-300 p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Name is managed in your account settings.</p>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1 text-black">Age</label>
                    <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full border border-black p-2 rounded-none bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="Enter your age"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1 text-black">Sex</label>
                    <select
                        value={formData.sex}
                        onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                        className="w-full border border-black p-2 rounded-none bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
                    >
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1 text-black">Location</label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full border border-black p-2 rounded-none bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="e.g. Westlands, Nairobi"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white py-3 uppercase font-bold tracking-wider hover:bg-gray-800 transition-colors mt-4"
                >
                    Save Profile
                </button>
            </form>
        </div>
    );
}
