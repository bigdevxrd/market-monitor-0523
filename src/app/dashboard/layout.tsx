'use client';

import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/lib/auth-context';
import { redirect } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // Redirect to login if user is not authenticated
  if (!isLoading && !user) {
    redirect('/auth/login');
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">{children}</main>
      </div>
    </div>
  );
}
