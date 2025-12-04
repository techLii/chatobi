import Link from 'next/link';
import { constituencies } from '@/config/constituencies';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wider mb-4 text-black">
            Welcome to Chatobi
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Connect with your constituency community
          </p>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Join real-time conversations, stay updated on local events, and engage with your neighbors across Nairobi's 17 constituencies.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="border border-black p-6 bg-white">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2 text-black uppercase">Real-Time Chat</h3>
            <p className="text-sm text-gray-700">
              Engage in live discussions with members of your constituency
            </p>
          </div>

          <div className="border border-black p-6 bg-white">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-bold text-lg mb-2 text-black uppercase">Local Events</h3>
            <p className="text-sm text-gray-700">
              Stay informed about upcoming community gatherings and activities
            </p>
          </div>

          <div className="border border-black p-6 bg-white">
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="font-bold text-lg mb-2 text-black uppercase">Direct Messages</h3>
            <p className="text-sm text-gray-700">
              Connect privately with other community members
            </p>
          </div>
        </div>

        {/* Constituencies Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-center text-black">
            Choose Your Constituency
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {constituencies.map((constituency) => (
              <Link
                key={constituency.id}
                href={`/chat/${constituency.id}`}
                className="border border-black p-4 bg-white hover:bg-black hover:text-white transition-colors group"
              >
                <h3 className="font-bold uppercase text-sm tracking-wide">
                  {constituency.name}
                </h3>
                <p className="text-xs mt-1 opacity-70">
                  Join the conversation →
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center border border-black p-8 bg-white">
          <h2 className="text-2xl font-bold uppercase mb-4 text-black">
            Get Started Today
          </h2>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Create an account to post messages, create events, and connect with your community.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="bg-black text-white px-8 py-3 hover:bg-gray-800 uppercase text-sm font-bold tracking-wide inline-block"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="border border-black px-8 py-3 hover:bg-black hover:text-white uppercase text-sm font-bold tracking-wide inline-block"
            >
              Login
            </Link>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            You can browse content without an account, but you'll need to log in to post.
          </p>
        </div>
      </main>
    </div>
  );
}
