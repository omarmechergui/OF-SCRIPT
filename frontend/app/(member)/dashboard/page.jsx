"use client";

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !dashboard?.success) {
    return (
      <div className="p-8">
        <Card className="p-6 border-bright-red bg-dark-red/10 text-center">
          <p className="text-bright-red">Failed to load dashboard data. Please try again.</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">Retry</Button>
        </Card>
      </div>
    );
  }

  const { user, progress, currentLearning, recentActivity } = dashboard.data;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-text">WELCOME BACK, {user.username.toUpperCase()}</h1>
        <p className="text-secondary-text">Keep building. Keep breaking.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Card */}
        <Card className="p-6 bg-surface-card border-border-default space-y-4">
          <h2 className="text-sm font-semibold tracking-wider text-secondary-text uppercase">Overall Progress</h2>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold font-mono text-primary-text">{progress.percentage}%</span>
            <span className="text-sm text-secondary-text mb-1">{progress.completedSessions} / {progress.totalSessions} Sessions</span>
          </div>
          <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
            <div className="h-full bg-primary-red transition-all duration-500" style={{ width: `${progress.percentage}%` }} />
          </div>
        </Card>

        {/* Current Learning */}
        <Card className="p-6 bg-surface-card border-border-default flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-wider text-secondary-text uppercase mb-2">Current Learning</h2>
            {currentLearning ? (
              <div className="space-y-1">
                <p className="text-xs font-mono text-primary-red">{currentLearning.week?.semester?.title} • {currentLearning.week?.title}</p>
                <h3 className="text-xl font-bold text-primary-text">{currentLearning.title}</h3>
              </div>
            ) : (
              <p className="text-secondary-text">You are all caught up!</p>
            )}
          </div>
          {currentLearning && (
            <Link href={`/sessions/${currentLearning.id}`} className="mt-6 block">
              <Button className="w-full bg-primary-red hover:bg-bright-red text-white">Continue Learning</Button>
            </Link>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-primary-text uppercase tracking-wider">Recent Activity</h2>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <Card className="p-6 bg-surface-card border-border-default text-center text-secondary-text">
              No recent activity yet.
            </Card>
          ) : (
            recentActivity.map((activity, idx) => (
              <Card key={`${activity.id}-${idx}`} className="p-4 bg-surface-card border-border-default flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-secondary-text">{activity.type}</span>
                  <span className="font-medium text-primary-text">{activity.title}</span>
                </div>
                <span className="text-xs text-muted-text">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
