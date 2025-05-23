'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-200"></div>
        <div className="mt-1 h-4 w-96 animate-pulse rounded-md bg-neutral-200"></div>
      </div>

      {/* Date Range Selector Loading */}
      <div className="flex justify-end">
        <div className="h-10 w-64 animate-pulse rounded-md bg-neutral-200"></div>
      </div>
      
      {/* Stats Cards Loading */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200"></div>
                <div className="ml-4">
                  <div className="h-4 w-24 animate-pulse rounded-md bg-neutral-200"></div>
                  <div className="mt-2 h-8 w-16 animate-pulse rounded-md bg-neutral-200"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts Loading */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Price Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full animate-pulse rounded-md bg-neutral-200"></div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full animate-pulse rounded-md bg-neutral-200"></div>
          </CardContent>
        </Card>
      </div>
      
      {/* Price Recommendations Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Price Drop Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 rounded-md border border-neutral-200 bg-white p-4">
                <div className="h-16 w-16 animate-pulse rounded-md bg-neutral-200"></div>
                <div className="flex-1">
                  <div className="h-5 w-3/4 animate-pulse rounded-md bg-neutral-200"></div>
                  <div className="mt-2 h-4 w-1/2 animate-pulse rounded-md bg-neutral-200"></div>
                  <div className="mt-2 h-4 w-full animate-pulse rounded-md bg-neutral-200"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
