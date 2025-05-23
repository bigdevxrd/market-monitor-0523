'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
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
      <h2 className="mt-6 text-2xl font-bold text-neutral-900">Something went wrong!</h2>
      <p className="mt-2 text-lg text-neutral-600">
        We apologize for the inconvenience. Please try again or contact support if the problem persists.
      </p>
      <div className="mt-8 space-x-4">
        <Button onClick={() => reset()} variant="primary">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go to Home
        </Button>
      </div>
      <div className="mt-6 text-xs text-neutral-400">
        Error Reference: {error.digest}
      </div>
    </div>
  );
}
