
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PageLoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white animate-pulse">
      {/* Header skeleton */}
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4">
        <div className="flex items-center space-x-3 md:space-x-4">
          <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 px-4 md:px-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        
        {/* Card skeletons */}
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
        
        {/* Progress indicators */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      {/* Bottom navigation skeleton */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-1 p-2">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="w-8 h-3 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoadingSkeleton;
