import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Adjust height to account for the sticky navbar (approx 60px)
        <div className="flex h-[calc(100vh-60px)] overflow-hidden bg-gray-50 dark:bg-gray-950">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 text-black dark:text-white">
                {children}
            </main>
        </div>
    );
}
