'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState({ type: '', message: '' });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setStatus({ type: '', message: '' });
      const res = await api.post('/auth/forgot-password', data);
      setStatus({ type: 'success', message: res.data.data.message });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error?.message || 'An error occurred' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2 text-center text-primary-text">Reset Password</h1>
        <p className="text-sm text-secondary-text text-center mb-6">Enter your email and we&apos;ll send you a reset link.</p>
        
        {status.message && (
          <div className={`mb-4 rounded border p-3 text-sm ${status.type === 'success' ? 'border-green-500/50 bg-green-500/10 text-green-500' : 'border-bright-red bg-dark-red/20 text-bright-red'}`}>
            {status.message}
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

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-secondary-text">
          Remember your password? <a href="/login" className="text-primary-red hover:text-bright-red">Sign in</a>
        </div>
      </Card>
    </div>
  );
}
