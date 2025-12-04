'use client';

import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, EVENTS_COLLECTION_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Event {
    $id: string;
    title: string;
    description: string;
    date: string;
    location?: string;
    constituency: string;
}

export default function EventsClient({ constituency }: { constituency: string }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: ''
    });

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    EVENTS_COLLECTION_ID,
                    [
                        Query.equal('constituency', constituency),
                        Query.orderAsc('date'),
                        Query.limit(50)
                    ]
                );
                setEvents(response.documents as unknown as Event[]);
            } catch (error) {
                console.error('Error loading events:', error);
            }
        };

        loadEvents();

        const unsubscribe = databases.client.subscribe(
            `databases.${DATABASE_ID}.collections.${EVENTS_COLLECTION_ID}.documents`,
            (response) => {
                if (response.events.includes('databases.*.collections.*.documents.*.create')) {
                    const payload = response.payload as Event;
                    if (payload.constituency === constituency) {
                        setEvents((prev) => [...prev, payload].sort((a, b) =>
                            new Date(a.date).getTime() - new Date(b.date).getTime()
                        ));
                    }
                }
                if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
                    const payload = response.payload as Event;
                    setEvents((prev) => prev.filter(e => e.$id !== payload.$id));
                }
            }
        );

        return () => {
            unsubscribe();
        };
    }, [constituency]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEvent.title.trim() || !newEvent.date) return;

        try {
            await databases.createDocument(
                DATABASE_ID,
                EVENTS_COLLECTION_ID,
                ID.unique(),
                {
                    title: newEvent.title,
                    description: newEvent.description,
                    date: new Date(newEvent.date).toISOString(),
                    location: newEvent.location || null,
                    constituency: constituency
                }
            );
            setNewEvent({ title: '', description: '', date: '', location: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleDelete = async (eventId: string) => {
        try {
            await databases.deleteDocument(DATABASE_ID, EVENTS_COLLECTION_ID, eventId);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isUpcoming = (dateString: string) => {
        return new Date(dateString) > new Date();
    };

    return (
        <div>
            {!user && (
                <div className="mb-4 p-4 border border-black bg-yellow-50">
                    <p className="text-sm mb-2 text-black">
                        <strong>You must be logged in to create events.</strong>
                    </p>
                    <Link
                        href="/login"
                        className="inline-block bg-black text-white px-4 py-2 text-sm uppercase tracking-wide hover:bg-gray-800"
                    >
                        Login
                    </Link>
                </div>
            )}

            {user && (
                <div className="mb-4">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-black text-white px-4 py-2 rounded-none hover:bg-gray-800 uppercase text-sm font-bold tracking-wide"
                    >
                        {showForm ? 'Cancel' : '+ Create Event'}
                    </button>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 border border-black p-4 bg-gray-50">
                    <div className="mb-3">
                        <label className="block text-sm font-bold mb-1 text-black">Event Title *</label>
                        <input
                            type="text"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            className="w-full border border-black p-2 rounded-none bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-bold mb-1 text-black">Description *</label>
                        <textarea
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            className="w-full border border-black p-2 rounded-none bg-white text-black focus:outline-none focus:ring-1 focus:ring-black h-20"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-bold mb-1 text-black">Date & Time *</label>
                        <input
                            type="datetime-local"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            className="w-full border border-black p-2 rounded-none bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-bold mb-1 text-black">Location</label>
                        <input
                            type="text"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                            className="w-full border border-black p-2 rounded-none bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded-none hover:bg-gray-800 uppercase text-sm font-bold tracking-wide"
                    >
                        Create Event
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {events.length === 0 ? (
                    <div className="text-gray-400 text-center italic text-sm border border-black p-8 bg-gray-50">
                        -- No events scheduled --
                    </div>
                ) : (
                    events.map((event) => (
                        <div
                            key={event.$id}
                            className="border border-black p-4 rounded-none bg-white hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="font-bold uppercase text-lg text-black">{event.title}</h2>
                                <div className="flex gap-2 items-center">
                                    <span className={`text-xs border border-black px-2 py-1 text-black ${isUpcoming(event.date) ? 'bg-green-100' : 'bg-gray-200'
                                        }`}>
                                        {isUpcoming(event.date) ? 'UPCOMING' : 'PAST'}
                                    </span>
                                    {user && (
                                        <button
                                            onClick={() => handleDelete(event.$id)}
                                            className="text-xs border border-red-600 text-red-600 px-2 py-1 hover:bg-red-600 hover:text-white"
                                        >
                                            DELETE
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                📅 {formatDate(event.date)}
                            </p>
                            {event.location && (
                                <p className="text-sm text-gray-600 mb-2">
                                    📍 {event.location}
                                </p>
                            )}
                            <p className="text-sm mt-2 text-black">{event.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
