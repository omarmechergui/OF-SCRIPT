'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Suspense } from 'react';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState({ type: '', message: '' });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      setStatus({ type: 'error', message: 'No reset token provided' });
      return;
    }

    try {
      setStatus({ type: '', message: '' });
      await api.post('/auth/reset-password', { token, newPassword: data.password });
      setStatus({ type: 'success', message: 'Password reset successfully. Redirecting...' });
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error?.message || 'An error occurred' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2 text-center text-primary-text">Create New Password</h1>
        
        {status.message && (
          <div className={`mb-4 rounded border p-3 text-sm ${status.type === 'success' ? 'border-green-500/50 bg-green-500/10 text-green-500' : 'border-bright-red bg-dark-red/20 text-bright-red'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-text mb-1">New Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-bright-red' : ''}
            />
            {errors.password && <p className="mt-1 text-xs text-bright-red">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-text mb-1">Confirm Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-bright-red' : ''}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-bright-red">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
