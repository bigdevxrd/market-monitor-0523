'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function SearchesLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-200"></div>
        <div className="mt-1 h-4 w-96 animate-pulse rounded-md bg-neutral-200"></div>
      </div>
      
      {/* Search Form Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="h-10 w-full animate-pulse rounded-md bg-neutral-200"></div>
            </div>
            <div className="h-10 w-24 animate-pulse rounded-md bg-neutral-200"></div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-md bg-neutral-200"></div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Search Results Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-neutral-200"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
                <div className="h-40 animate-pulse bg-neutral-200"></div>
                <div className="p-4">
                  <div className="h-5 w-full animate-pulse rounded-md bg-neutral-200"></div>
                  <div className="mt-2 h-4 w-1/2 animate-pulse rounded-md bg-neutral-200"></div>
                  <div className="mt-4 h-8 w-full animate-pulse rounded-md bg-neutral-200"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
