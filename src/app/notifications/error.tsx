'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NotificationsErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Notifications page error:', error);
  }, [error]);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-xl font-bold text-neutral-900">Notification error occurred</h2>
      <p className="mt-2 text-neutral-600">
        We couldn&apos;t load your notifications. Please try again or check back later.
      </p>
      <div className="mt-6 space-x-4">
        <Button onClick={() => reset()} variant="primary">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
          Back to Dashboard
        </Button>
      </div>
      <div className="mt-4 text-xs text-neutral-400">
        Error Reference: {error.digest}
      </div>
    </div>
  );
}
