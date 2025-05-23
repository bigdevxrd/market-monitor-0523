'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function NotificationsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-200"></div>
        <div className="mt-1 h-4 w-96 animate-pulse rounded-md bg-neutral-200"></div>
      </div>

      {/* Filters Loading */}
      <div className="flex flex-wrap gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-32 animate-pulse rounded-md bg-neutral-200"></div>
        ))}
      </div>
      
      {/* Notifications Loading */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Notifications</CardTitle>
            <div className="h-10 w-24 animate-pulse rounded-md bg-neutral-200"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 rounded-md border border-neutral-200 bg-white p-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200"></div>
                <div className="flex-1">
                  <div className="h-5 w-3/4 animate-pulse rounded-md bg-neutral-200"></div>
                  <div className="mt-2 h-4 w-full animate-pulse rounded-md bg-neutral-200"></div>
                  <div className="mt-2 h-4 w-1/2 animate-pulse rounded-md bg-neutral-200"></div>
                </div>
                <div className="h-8 w-8 animate-pulse rounded-md bg-neutral-200"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Pagination Loading */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-10 animate-pulse rounded-md bg-neutral-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
