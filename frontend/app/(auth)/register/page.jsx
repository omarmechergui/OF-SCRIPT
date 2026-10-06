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

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      await authRegister(data);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'An error occurred during registration');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary-text">Join OFFSCRIPT</h1>
        
        {error && (
          <div className="mb-4 rounded border border-bright-red bg-dark-red/20 p-3 text-sm text-bright-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary-text">First Name</label>
              <Input
                type="text"
                placeholder="John"
                {...register('firstName')}
                className={errors.firstName ? 'border-bright-red' : ''}
              />
              {errors.firstName && <p className="mt-1 text-xs text-bright-red">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary-text">Last Name</label>
              <Input
                type="text"
                placeholder="Doe"
                {...register('lastName')}
                className={errors.lastName ? 'border-bright-red' : ''}
              />
              {errors.lastName && <p className="mt-1 text-xs text-bright-red">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-text">Username</label>
            <Input
              type="text"
              placeholder="johndoe"
              {...register('username')}
              className={errors.username ? 'border-bright-red' : ''}
            />
            {errors.username && <p className="mt-1 text-xs text-bright-red">{errors.username.message}</p>}
          </div>

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
            <label className="block text-sm font-medium text-secondary-text mb-1">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-bright-red' : ''}
            />
            {errors.password && <p className="mt-1 text-xs text-bright-red">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-secondary-text">
          Already have an account? <a href="/login" className="text-primary-red hover:text-bright-red">Sign in</a>
        </div>
      </Card>
    </div>
  );
}
