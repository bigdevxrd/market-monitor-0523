'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AnalyticsErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Analytics page error:', error);
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-xl font-bold text-neutral-900">Analytics error occurred</h2>
      <p className="mt-2 text-neutral-600">
        We couldn&apos;t load your analytics data. Please try again or check back later.
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
