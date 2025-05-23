'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
}: EmptyStateProps) {
  const defaultIcon = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-12 w-12 text-neutral-400" 
      fill="none"
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
      />
    </svg>
  );

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
        {icon || defaultIcon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-neutral-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-neutral-600">{description}</p>
      
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {action && (
            action.href ? (
              <Link href={action.href}>
                <Button variant="primary">{action.label}</Button>
              </Link>
            ) : (
              <Button variant="primary" onClick={action.onClick}>{action.label}</Button>
            )
          )}
          
          {secondaryAction && (
            secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button variant="outline">{secondaryAction.label}</Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
