'use client';

import React from 'react';
import Button from '@/components/ui/Button';

type ErrorSeverity = 'critical' | 'warning' | 'info';

interface ErrorHandlerProps {
  title?: string;
  message?: string;
  error?: Error;
  severity?: ErrorSeverity;
  retry?: () => void;
  homeLink?: boolean;
  backLink?: boolean;
  children?: React.ReactNode;
}

export default function ErrorHandler({
  title,
  message,
  error,
  severity = 'warning',
  retry,
  homeLink = true,
  backLink = false,
  children,
}: ErrorHandlerProps) {
  const getIconBySeverity = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical':
        return (
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
        );
      case 'warning':
        return (
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'info':
        return (
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getColorBySeverity = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'info':
        return 'bg-blue-100 text-blue-600';
    }
  };

  const defaultTitle = {
    critical: 'Something went wrong!',
    warning: 'Warning',
    info: 'Information',
  };

  const defaultMessage = {
    critical: 'We apologize for the inconvenience. Please try again or contact support if the problem persists.',
    warning: 'This operation encountered some issues, but you can continue with caution.',
    info: 'Please review the following information before proceeding.',
  };

  const displayTitle = title || defaultTitle[severity];
  const displayMessage = message || defaultMessage[severity];

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className={`flex h-20 w-20 items-center justify-center rounded-full ${getColorBySeverity(severity)}`}>
        {getIconBySeverity(severity)}
      </div>
      <h2 className="mt-6 text-xl font-bold text-neutral-900">{displayTitle}</h2>
      <p className="mt-2 max-w-md text-neutral-600">{displayMessage}</p>
      
      {children && <div className="mt-4">{children}</div>}
      
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {retry && (
          <Button onClick={retry} variant="primary">
            Try again
          </Button>
        )}
        
        {backLink && (
          <Button onClick={() => window.history.back()} variant="outline">
            Go back
          </Button>
        )}
        
        {homeLink && (
          <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
            Back to Dashboard
          </Button>
        )}
      </div>
      
      {error && error.message && (
        <div className="mt-6 max-w-md rounded-md bg-neutral-100 p-4 text-left text-sm text-neutral-800">
          <p className="font-medium">Error details:</p>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words text-xs">{error.message}</pre>
          {error.stack && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-medium text-neutral-600">Stack trace</summary>
              <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words text-xs">{error.stack}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
