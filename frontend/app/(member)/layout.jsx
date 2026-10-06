'use client';

import { useAuth } from '@/providers/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function MemberLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/login?redirect=\${pathname}`);
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-primary-text">
        <div className="animate-pulse">Loading OFFSCRIPT...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="member-layout min-h-screen bg-background">
      {/* Top Navbar / Sidebar would go here */}
      <nav className="border-b border-border-default bg-surface px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-primary-text text-xl">OFFSCRIPT</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-secondary-text">Logged in as {user.username}</span>
        </div>
      </nav>
      
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
