'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/projects';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const projectId = params.id;

  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => projectsApi.getProject(projectId),
  });

  const startMutation = useMutation({
    mutationFn: () => projectsApi.startProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects', projectId]);
    }
  });

  const submitMutation = useMutation({
    mutationFn: (data) => projectsApi.submitProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects', projectId]);
      queryClient.invalidateQueries(['dashboard']);
      queryClient.invalidateQueries(['points']);
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2">
            <Card className="p-6 border-gray-800 bg-gray-900/50"><Skeleton className="h-32 w-full" /></Card>
          </div>
          <div>
            <Card className="p-6 border-gray-800 bg-gray-900/50"><Skeleton className="h-24 w-full" /></Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data?.project) {
    return (
      <div className="p-8 text-center text-red-500">
        Project not found or an error occurred.
      </div>
    );
  }

  const { project, progress, submission } = data.data;

  const isCompleted = progress?.status === 'COMPLETED' || submission;
  const isInProgress = progress?.status === 'IN_PROGRESS' && !isCompleted;

  const handleStart = () => {
    startMutation.mutate();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl) return;
    submitMutation.mutate({ repositoryUrl: repoUrl, demoUrl: demoUrl || undefined });
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <button 
            onClick={() => router.push('/projects')}
            className="text-sm text-gray-500 hover:text-red-400 mb-4 inline-block transition-colors"
          >
            ← Back to Projects
          </button>
          <h1 className="text-3xl font-bold text-gray-100">{project.title}</h1>
        </div>
        <Badge variant={isCompleted ? 'success' : isInProgress ? 'default' : 'outline'} className="text-sm">
          {isCompleted ? 'COMPLETED' : isInProgress ? 'IN PROGRESS' : 'NOT STARTED'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-gray-800 bg-gray-900/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Description</h2>
            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            
            {project.requirements && (
              <>
                <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-200">Requirements</h3>
                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{project.requirements}</p>
              </>
            )}
          </Card>

          {!isCompleted && isInProgress && (
            <Card className="p-6 border-gray-800 bg-gray-900/50">
              <h2 className="text-xl font-semibold mb-4 text-gray-200">Submit Project</h2>
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
                  <label className="block text-sm font-medium text-gray-400 mb-1">Demo URL (Optional)</label>
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
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Project'}
                </Button>
              </form>
            </Card>
          )}

          {isCompleted && submission && (
            <Card className="p-6 border-green-500/20 bg-green-500/10">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Submission Received</h2>
              <div className="space-y-2 text-sm text-gray-300">
                <p><span className="text-gray-500">Repository:</span> <a href={submission.repositoryUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{submission.repositoryUrl}</a></p>
                {submission.demoUrl && (
                  <p><span className="text-gray-500">Demo:</span> <a href={submission.demoUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{submission.demoUrl}</a></p>
                )}
                <p><span className="text-gray-500">Status:</span> {submission.status}</p>
                <p><span className="text-gray-500">Submitted:</span> {new Date(submission.submittedAt).toLocaleDateString()}</p>
                {submission.score !== null && <p><span className="text-gray-500">Score:</span> {submission.score}</p>}
                {submission.feedback && <p><span className="text-gray-500">Feedback:</span> {submission.feedback}</p>}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-gray-800 bg-gray-900/50">
            <h3 className="font-semibold text-gray-200 mb-4">Metadata</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span className="text-gray-500">Difficulty</span>
                <span className="text-gray-300">{project.difficulty}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Deadline</span>
                <span className="text-gray-300">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'None'}</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map(tech => (
                  <Badge key={tech} variant="outline" className="text-xs border-gray-700 text-gray-400">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {!isCompleted && !isInProgress && (
              <Button 
                onClick={handleStart} 
                disabled={startMutation.isPending}
                className="w-full mt-6"
              >
                {startMutation.isPending ? 'Starting...' : 'Start Project'}
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
