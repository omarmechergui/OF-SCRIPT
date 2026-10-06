'use client';

import { useQuery } from '@tanstack/react-query';
import { competitionsApi } from '@/lib/api/competitions';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export default function CompetitionsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['competitions'],
    queryFn: () => competitionsApi.getCompetitions(1),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 h-48 border-gray-800 bg-gray-900/50">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
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
          <h3 className="font-semibold mb-2">Failed to load competitions</h3>
          <p className="text-sm opacity-80">{error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  const { competitions = [], registrations: regMap = {} } = data?.data || {};

  return (
    <div className="space-y-6 p-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Competitions</h1>
        <p className="text-gray-400">Test your skills against others in time-boxed events.</p>
      </div>

      {competitions.length === 0 ? (
        <Card className="p-12 text-center text-gray-500 border-gray-800 bg-gray-900/50">
          <p>No active competitions at the moment.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {competitions.map((comp) => {
            const reg = regMap[comp.id];
            
            return (
              <Link key={comp.id} href={`/competitions/${comp.id}`}>
                <Card className="p-6 h-full flex flex-col hover:border-red-500/50 transition-colors group cursor-pointer border-gray-800 bg-gray-900/50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-xl group-hover:text-red-400 transition-colors">{comp.title}</h3>
                    <Badge variant={
                      comp.status === 'ACTIVE' ? 'destructive' :
                      comp.status === 'REGISTRATION_OPEN' ? 'success' : 'outline'
                    }>
                      {comp.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-6 flex-grow line-clamp-2">
                    {comp.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-800 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Start Date</p>
                      <p className="text-gray-300 font-mono">{comp.startAt ? new Date(comp.startAt).toLocaleDateString() : 'TBA'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Your Status</p>
                      <p className={reg ? 'text-green-400 font-semibold' : 'text-gray-500'}>
                        {reg ? reg.status : 'NOT REGISTERED'}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
