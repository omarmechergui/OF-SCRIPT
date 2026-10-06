"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from '@/lib/api/assignments';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AssignmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [submissionContent, setSubmissionContent] = useState('');

  const { data: assignmentData, isLoading, error } = useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentsApi.getAssignment(id),
  });

  const submitMutation = useMutation({
    mutationFn: (content) => assignmentsApi.submitAssignment(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['assignment', id]);
      queryClient.invalidateQueries(['assignments']);
      setSubmissionContent('');
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !assignmentData?.success) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Card className="p-6 border-bright-red bg-dark-red/10 text-center">
          <p className="text-bright-red">Assignment not found or failed to load.</p>
          <Button onClick={() => router.push('/assignments')} className="mt-4" variant="outline">Back to Assignments</Button>
        </Card>
      </div>
    );
  }

  const { assignment, submission } = assignmentData.data;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submissionContent.trim()) return;
    submitMutation.mutate(submissionContent);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header className="space-y-4 border-b border-border-default pb-6">
        <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
          <div>
            <p className="text-sm font-mono text-primary-red mb-1">{assignment.session?.title}</p>
            <h1 className="text-3xl font-bold text-primary-text">{assignment.title}</h1>
            {assignment.deadline && <p className="text-sm text-secondary-text mt-2">Due: {new Date(assignment.deadline).toLocaleDateString()}</p>}
          </div>
          {submission && (
            <span className={`px-3 py-1 rounded-full text-sm font-bold font-mono ${submission.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' : 'bg-primary-red/20 text-primary-red'}`}>
              {submission.status}
            </span>
          )}
        </div>
        <p className="text-secondary-text">{assignment.description}</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-primary-text">Instructions</h2>
        <div className="p-6 bg-surface-card border-border-default rounded-md text-primary-text">
          {assignment.instructions ? (
            <div dangerouslySetInnerHTML={{ __html: assignment.instructions }} />
          ) : (
            <p className="italic text-muted-text">No specific instructions provided.</p>
          )}
        </div>
      </section>

      <section className="space-y-4 pt-6">
        <h2 className="text-xl font-bold text-primary-text">Your Submission</h2>
        
        {submission && submission.status !== 'REJECTED' ? (
          <Card className="p-6 bg-surface-elevated border-border-default space-y-4">
            <div className="flex justify-between items-center text-sm font-mono text-secondary-text">
              <span>Attempt {submission.attemptNumber}</span>
              <span>{new Date(submission.submittedAt).toLocaleString()}</span>
            </div>
            <div className="p-4 bg-background-primary rounded border border-border-default font-mono text-sm whitespace-pre-wrap text-primary-text">
              {submission.content}
            </div>
            {submission.feedback && (
              <div className="mt-4 p-4 border-l-2 border-primary-red bg-dark-red/10 text-primary-text">
                <p className="text-sm font-bold mb-1">Feedback:</p>
                <p>{submission.feedback}</p>
              </div>
            )}
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              placeholder="Enter your submission link, repository, or text here..."
              className="w-full h-48 p-4 bg-surface-card border border-border-default rounded-md text-primary-text focus:border-primary-red focus:ring-1 focus:ring-primary-red outline-none resize-y"
              disabled={submitMutation.isPending}
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push('/assignments')}>Cancel</Button>
              <Button type="submit" className="bg-primary-red hover:bg-bright-red text-white" disabled={submitMutation.isPending || !submissionContent.trim()}>
                {submitMutation.isPending ? 'Submitting...' : 'Submit Assignment'}
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
