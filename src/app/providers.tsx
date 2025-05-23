'use client';

import { AuthProvider } from '@/lib/auth-context';

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
