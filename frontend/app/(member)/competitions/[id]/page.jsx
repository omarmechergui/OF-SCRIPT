'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { competitionsApi } from '@/lib/api/competitions';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';

export default function CompetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const compId = params.id;

  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['competitions', compId],
    queryFn: () => competitionsApi.getCompetition(compId),
  });

  const registerMutation = useMutation({
    mutationFn: () => competitionsApi.register(compId),
    onSuccess: () => {
      queryClient.invalidateQueries(['competitions', compId]);
    }
  });

  const cancelMutation = useMutation({
    mutationFn: () => competitionsApi.cancelRegistration(compId),
    onSuccess: () => {
      queryClient.invalidateQueries(['competitions', compId]);
    }
  });

  const submitMutation = useMutation({
    mutationFn: (data) => competitionsApi.submitEntry(compId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['competitions', compId]);
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-full" />
        <Card className="p-6 border-gray-800"><Skeleton className="h-32 w-full" /></Card>
      </div>
    );
  }

  if (isError || !data?.data?.competition) {
    return (
      <div className="p-8 text-center text-red-500">
        Competition not found or error occurred.
      </div>
    );
  }

  const { competition, registration, submission } = data.data;

  const isRegistered = registration?.status === 'REGISTERED';
  const canRegister = competition.status === 'REGISTRATION_OPEN' && !isRegistered;
  const canCancel = competition.status !== 'ACTIVE' && competition.status !== 'ENDED' && isRegistered;
  const canSubmit = competition.status === 'ACTIVE' && isRegistered && !submission;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl) return;
    submitMutation.mutate({ repositoryUrl: repoUrl, demoUrl: demoUrl || undefined });
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => router.push('/competitions')}
            className="text-sm text-gray-500 hover:text-red-400 mb-4 inline-block transition-colors"
          >
            ← Back to Competitions
          </button>
          <h1 className="text-3xl font-bold text-gray-100">{competition.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {isRegistered && <Badge variant="success">REGISTERED</Badge>}
          <Badge variant={competition.status === 'ACTIVE' ? 'destructive' : 'outline'}>
            {competition.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-gray-800 bg-gray-900/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">About</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{competition.description}</p>
            
            {competition.rules && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-200">Rules & Guidelines</h3>
                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{competition.rules}</p>
              </>
            )}
          </Card>

          {canSubmit && (
            <Card className="p-6 border-gray-800 bg-gray-900/50">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Submit Entry</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Repository URL *</label>
                  <Input 
                    type="url" 
                    placeholder="https://github.com/..." 
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Demo URL</label>
                  <Input 
                    type="url" 
                    placeholder="https://..." 
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                  />
                </div>
                {submitMutation.isError && (
                  <p className="text-red-500 text-sm">{submitMutation.error.response?.data?.error?.message || 'Submission failed'}</p>
                )}
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending || !repoUrl}
                  className="w-full"
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Entry'}
                </Button>
              </form>
            </Card>
          )}

          {submission && (
            <Card className="p-6 border-green-500/20 bg-green-500/10">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Entry Submitted</h2>
              <div className="space-y-2 text-sm text-gray-300">
                <p><span className="text-gray-500">Repository:</span> <a href={submission.repositoryUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{submission.repositoryUrl}</a></p>
                {submission.demoUrl && (
                  <p><span className="text-gray-500">Demo:</span> <a href={submission.demoUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{submission.demoUrl}</a></p>
                )}
                <p><span className="text-gray-500">Status:</span> {submission.status}</p>
                {submission.score !== null && <p><span className="text-gray-500">Score:</span> {submission.score}</p>}
                {submission.feedback && <p><span className="text-gray-500">Feedback:</span> {submission.feedback}</p>}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-gray-800 bg-gray-900/50">
            <h3 className="font-semibold text-gray-200 mb-4">Timeline</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Registration Opens</span>
                <span className="text-gray-300 font-mono">{competition.registrationStartAt ? new Date(competition.registrationStartAt).toLocaleDateString() : '-'}</span>
              </li>
              <li>
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Registration Closes</span>
                <span className="text-gray-300 font-mono">{competition.registrationEndAt ? new Date(competition.registrationEndAt).toLocaleDateString() : '-'}</span>
              </li>
              <li>
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Competition Starts</span>
                <span className="text-gray-300 font-mono">{competition.startAt ? new Date(competition.startAt).toLocaleDateString() : '-'}</span>
              </li>
              <li>
                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Submission Deadline</span>
                <span className="text-gray-300 font-mono">{competition.submissionEndAt ? new Date(competition.submissionEndAt).toLocaleDateString() : '-'}</span>
              </li>
            </ul>

            <div className="mt-8 space-y-3">
              {canRegister && (
                <Button 
                  onClick={() => registerMutation.mutate()} 
                  disabled={registerMutation.isPending}
                  className="w-full"
                >
                  {registerMutation.isPending ? 'Registering...' : 'Register Now'}
                </Button>
              )}
              {canCancel && (
                <Button 
                  variant="outline"
                  onClick={() => cancelMutation.mutate()} 
                  disabled={cancelMutation.isPending}
                  className="w-full border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-400/50"
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Registration'}
                </Button>
              )}
              {registerMutation.isError && (
                <p className="text-red-500 text-sm text-center mt-2">{registerMutation.error.response?.data?.error?.message || 'Registration failed'}</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
