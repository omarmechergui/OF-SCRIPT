'use client';

import { useQuery } from '@tanstack/react-query';
import { badgesApi } from '@/lib/api/badges';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function BadgesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['badges'],
    queryFn: () => badgesApi.getBadges(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-8 max-w-6xl mx-auto">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 flex flex-col items-center justify-center text-center aspect-square border-gray-800 bg-gray-900/50">
              <Skeleton className="h-16 w-16 rounded-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="p-6 rounded-md border border-red-500/20 bg-red-500/10 text-red-500">
          <h3 className="font-semibold mb-2">Failed to load badges</h3>
          <p className="text-sm opacity-80">{error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  const { badges = [], earned: earnedMap = {}, totalEarned = 0, totalAvailable = 0 } = data?.data || {};

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Badges & Achievements</h1>
        <p className="text-gray-400">Unlock badges by completing milestones, projects, and competitions.</p>
        
        <div className="mt-6 flex items-center gap-4 p-4 rounded-lg bg-gray-900 border border-gray-800 inline-flex">
          <div className="text-4xl font-mono text-red-400 font-bold">{totalEarned}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider leading-tight">
            Earned <br />of {totalAvailable}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {badges.map((badge) => {
          const isEarned = !!earnedMap[badge.id];
          const earnedInfo = earnedMap[badge.id];

          return (
            <Card 
              key={badge.id} 
              className={`p-6 flex flex-col items-center justify-center text-center aspect-square transition-all duration-300
                ${isEarned 
                  ? 'border-red-500/30 bg-gray-900/80 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                  : 'border-gray-800 bg-gray-900/30 opacity-60 grayscale'
                }`}
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                {badge.icon || '🏆'}
              </div>
              <h3 className={`font-bold mb-2 ${isEarned ? 'text-gray-100' : 'text-gray-500'}`}>
                {badge.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-3 mb-3">
                {badge.description}
              </p>
              
              <div className="mt-auto">
                {isEarned ? (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-red-400 bg-red-400/10 px-2 py-1 rounded">
                    Earned {new Date(earnedInfo.earnedAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-600 bg-gray-800 px-2 py-1 rounded">
                    Locked
                  </span>
                )}
              </div>
            </Card>
          );
        })}
        
        {badges.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No badges available yet.
          </div>
        )}
      </div>
    </div>
  );
}
