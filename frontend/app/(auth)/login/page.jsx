'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await login(data);
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');
      const safeRedirect = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/dashboard';
      router.push(safeRedirect);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred during login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary-text">Sign In to OFFSCRIPT</h1>
        
        {error && (
          <div className="mb-4 rounded border border-bright-red bg-dark-red/20 p-3 text-sm text-bright-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-text">Email</label>
            <Input
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={errors.email ? 'border-bright-red' : ''}
            />
            {errors.email && <p className="mt-1 text-xs text-bright-red">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-secondary-text">Password</label>
              <a href="/forgot-password" className="text-xs text-primary-red hover:text-bright-red">Forgot password?</a>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-bright-red' : ''}
            />
            {errors.password && <p className="mt-1 text-xs text-bright-red">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-secondary-text">
          Don&apos;t have an account? <a href="/register" className="text-primary-red hover:text-bright-red">Sign up</a>
        </div>
      </Card>
    </div>
  );
}
