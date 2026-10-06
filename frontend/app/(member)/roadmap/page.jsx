"use client";

import { useQuery } from '@tanstack/react-query';
import { roadmapApi } from '@/lib/api/roadmap';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RoadmapPage() {
  const { data: roadmapData, isLoading, error } = useQuery({
    queryKey: ['roadmap'],
    queryFn: roadmapApi.getRoadmap,
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !roadmapData?.success) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Card className="p-6 border-bright-red bg-dark-red/10 text-center">
          <p className="text-bright-red">Failed to load roadmap data.</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">Retry</Button>
        </Card>
      </div>
    );
  }

  const { semesters, progress, submissions } = roadmapData.data;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-text">LEARNING ROADMAP</h1>
        <p className="text-secondary-text">Your path to mastering the curriculum.</p>
      </header>

      <div className="space-y-12">
        {semesters.map(semester => (
          <section key={semester.id} className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-border-default pb-2 text-primary-text">{semester.title}</h2>
            <div className="relative pl-6 space-y-8 border-l-2 border-border-default ml-2">
              {semester.weeks.map(week => (
                <div key={week.id} className="relative">
                  <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-surface-card border-2 border-primary-red"></div>
                  <h3 className="text-xl font-bold mb-4 text-primary-text">{week.title}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {week.sessions.map(session => {
                      const p = progress[session.id];
                      const isCompleted = p?.status === 'COMPLETED';
                      const isInProgress = p?.status === 'IN_PROGRESS';
                      
                      return (
                        <Card key={session.id} className="p-4 bg-surface-card border-border-default hover:border-primary-red transition-colors">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-primary-text">{session.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {isCompleted && <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs font-mono">COMPLETED</span>}
                                {isInProgress && <span className="px-2 py-0.5 rounded-full bg-primary-red/20 text-primary-red text-xs font-mono">IN PROGRESS</span>}
                                {!isCompleted && !isInProgress && <span className="text-xs text-muted-text font-mono">NOT STARTED</span>}
                                {session.estimatedMinutes && <span className="text-xs text-secondary-text">• {session.estimatedMinutes} min</span>}
                              </div>
                            </div>
                            <Link href={`/sessions/${session.id}`}>
                              <Button variant={isCompleted ? "outline" : "default"} className={!isCompleted ? "bg-primary-red hover:bg-bright-red text-white" : ""}>
                                {isCompleted ? 'Review' : 'Start'}
                              </Button>
                            </Link>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
