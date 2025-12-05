'use client';

export default function Marketplace() {
    return (
        <div className="border border-black dark:border-gray-700 p-4 bg-white dark:bg-gray-800 h-full">
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 text-black dark:text-white border-b border-black dark:border-gray-700 pb-2">
                Marketplace
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-8">
                Coming Soon
            </div>
            {/* Placeholder items for visual structure */}
            <div className="space-y-3 opacity-50">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-2 items-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex-1">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 w-3/4 mb-1"></div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
