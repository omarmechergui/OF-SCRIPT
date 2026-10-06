"use client";

import { useQuery } from '@tanstack/react-query';
import { assignmentsApi } from '@/lib/api/assignments';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AssignmentsPage() {
  const { data: assignmentsData, isLoading, error } = useQuery({
    queryKey: ['assignments'],
    queryFn: assignmentsApi.getAssignments,
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !assignmentsData?.success) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Card className="p-6 border-bright-red bg-dark-red/10 text-center">
          <p className="text-bright-red">Failed to load assignments data.</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">Retry</Button>
        </Card>
      </div>
    );
  }

  const { assignments, submissions } = assignmentsData.data;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="space-y-2 border-b border-border-default pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary-text">ASSIGNMENTS</h1>
        <p className="text-secondary-text">Put your learning into practice.</p>
      </header>

      {assignments.length === 0 ? (
        <Card className="p-8 text-center bg-surface-card border-border-default text-secondary-text">
          No assignments available yet.
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignments.map(assignment => {
            const submission = submissions[assignment.id];
            
            return (
              <Card key={assignment.id} className="p-5 bg-surface-card border-border-default hover:border-primary-red transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="space-y-1">
                  <p className="text-xs font-mono text-primary-red">{assignment.session?.week?.title} • {assignment.session?.title}</p>
                  <h2 className="text-xl font-bold text-primary-text">{assignment.title}</h2>
                  <p className="text-sm text-secondary-text line-clamp-2">{assignment.description}</p>
                  
                  <div className="flex gap-3 mt-3 items-center">
                    {submission ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${submission.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' : 'bg-primary-red/20 text-primary-red'}`}>
                        {submission.status}
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-muted-text">NOT SUBMITTED</span>
                    )}
                    {assignment.deadline && (
                      <span className="text-xs text-secondary-text">Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                
                <Link href={`/assignments/${assignment.id}`} className="shrink-0 w-full sm:w-auto">
                  <Button className="w-full" variant={submission ? "outline" : "default"}>
                    {submission ? 'View Submission' : 'Start Assignment'}
                  </Button>
                </Link>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
