"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionsApi } from '@/lib/api/sessions';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function SessionPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: sessionData, isLoading, error } = useQuery({
    queryKey: ['session', id],
    queryFn: () => sessionsApi.getSession(id),
  });

  const progressMutation = useMutation({
    mutationFn: (status) => sessionsApi.updateProgress(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['session', id]);
      queryClient.invalidateQueries(['dashboard']);
      queryClient.invalidateQueries(['roadmap']);
    }
  });

  // Auto-start session if not started
  useEffect(() => {
    if (sessionData?.success) {
      const p = sessionData.data.progress;
      if (!p || p.status === 'NOT_STARTED') {
        progressMutation.mutate('IN_PROGRESS');
      }
    }
  }, [sessionData, progressMutation]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !sessionData?.success) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Card className="p-6 border-bright-red bg-dark-red/10 text-center">
          <p className="text-bright-red">Session not found or failed to load.</p>
          <Button onClick={() => router.push('/roadmap')} className="mt-4" variant="outline">Back to Roadmap</Button>
        </Card>
      </div>
    );
  }

  const { session, progress } = sessionData.data;
  const isCompleted = progress?.status === 'COMPLETED';

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="space-y-4 border-b border-border-default pb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-mono text-primary-red mb-1">{session.week?.semester?.title} • {session.week?.title}</p>
            <h1 className="text-3xl font-bold text-primary-text">{session.title}</h1>
          </div>
          {isCompleted && <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-bold font-mono">COMPLETED</span>}
        </div>
        <p className="text-secondary-text">{session.description}</p>
      </header>

      <section className="prose prose-invert max-w-none text-primary-text">
        {session.content ? (
          <div dangerouslySetInnerHTML={{ __html: session.content }} />
        ) : (
          <p className="italic text-muted-text">Content is currently empty.</p>
        )}
      </section>

      {session.assignments && session.assignments.length > 0 && (
        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-bold border-t border-border-default pt-6">Assignments</h2>
          <div className="grid gap-4">
            {session.assignments.map(a => (
              <Card key={a.id} className="p-4 bg-surface-card border-border-default flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{a.title}</h3>
                  <p className="text-sm text-secondary-text">{a.description}</p>
                </div>
                <Link href={`/assignments/${a.id}`}>
                  <Button variant="outline">View Assignment</Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="pt-8 flex justify-between">
        <Button variant="outline" onClick={() => router.push('/roadmap')}>Back to Roadmap</Button>
        <Button 
          onClick={() => progressMutation.mutate('COMPLETED')}
          disabled={isCompleted || progressMutation.isPending}
          className={!isCompleted ? "bg-primary-red hover:bg-bright-red text-white" : ""}
        >
          {isCompleted ? 'Completed' : 'Mark as Complete'}
        </Button>
      </div>
    </div>
  );
}
