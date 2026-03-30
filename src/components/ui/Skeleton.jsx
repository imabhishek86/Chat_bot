import React from 'react';

const SkeletonBase = ({ className }) => (
    <div className={`bg-white/5 animate-pulse rounded-2xl ${className}`} />
);

export const SummarySkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel p-6 rounded-[2.5rem] flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <SkeletonBase className="w-12 h-12" />
                    <SkeletonBase className="w-8 h-10" />
                </div>
                <div className="flex flex-col gap-2">
                    <SkeletonBase className="w-20 h-2" />
                    <SkeletonBase className="w-12 h-1" />
                </div>
            </div>
        ))}
    </div>
);

export const AssignmentSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel p-6 rounded-[2.5rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-5 flex-1">
                    <SkeletonBase className="w-14 h-14 rounded-2xl" />
                    <div className="flex flex-col gap-3 flex-1">
                        <SkeletonBase className="w-3/4 h-5" />
                        <div className="flex gap-4">
                            <SkeletonBase className="w-24 h-4" />
                            <SkeletonBase className="w-16 h-4" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <SkeletonBase className="w-24 h-10 rounded-full" />
                    <SkeletonBase className="w-10 h-10 rounded-full" />
                </div>
            </div>
        ))}
    </div>
);

const DashboardSkeleton = () => (
    <div className="stack-gap w-full px-2">
        <div className="flex flex-col gap-4 mb-8">
            <SkeletonBase className="w-48 h-8" />
            <SkeletonBase className="w-32 h-4" />
        </div>
        <SummarySkeleton />
        <div className="flex flex-col gap-6">
            <SkeletonBase className="w-32 h-4" />
            <AssignmentSkeleton />
        </div>
    </div>
);

export default DashboardSkeleton;
