'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import SearchResultCard from '@/components/ui/SearchResultCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';

export default function Dashboard() {
  const { user } = useAuth();
  // Dummy data for demonstration
  const [recentSearches] = useState([
    { id: 1, name: 'Vintage Nike Sneakers', count: 12, lastUpdated: new Date() },
    { id: 2, name: 'Canon EOS Camera', count: 5, lastUpdated: new Date(Date.now() - 86400000) },
    { id: 3, name: 'Mid Century Coffee Table', count: 8, lastUpdated: new Date(Date.now() - 172800000) },
  ]);

  const [latestResults] = useState([
    {
      id: 1,
      title: 'Nike Air Max 90 Vintage 1990s OG',
      price: 120,
      image: 'https://plus.unsplash.com/premium_photo-1682126149925-a1a298241996?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG5pa2UlMjBzbmVha2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
      marketplace: 'Depop',
      relevanceScore: 9,
      url: '#',
      createdAt: new Date(Date.now() - 1800000),
      seller: { name: 'vintagekicks', rating: 4.8 },
      location: 'Los Angeles, CA',
      condition: 'Good',
    },
    {
      id: 2,
      title: 'Canon EOS 5D Mark III DSLR Camera Body Only',
      price: 850,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Fub24lMjBjYW1lcmF8ZW58MHx8MHx8fDA%3D',
      marketplace: 'eBay',
      relevanceScore: 8,
      url: '#',
      createdAt: new Date(Date.now() - 3600000),
      seller: { name: 'photogear', rating: 4.9 },
      location: 'New York, NY',
      condition: 'Like New',
    },
    {
      id: 3,
      title: 'Mid Century Modern Coffee Table Walnut',
      price: 175,
      image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29mZmVlJTIwdGFibGV8ZW58MHx8MHx8fDA%3D',
      marketplace: 'Facebook',
      relevanceScore: 7,
      url: '#',
      createdAt: new Date(Date.now() - 7200000),
      seller: { name: 'modernhome' },
      location: 'Chicago, IL',
      condition: 'Good',
    },
  ]);

  const [stats] = useState({
    activeSearches: 8,
    totalNotifications: 128,
    marketplacesCovered: 5,
    averageRelevance: 8.2,
  });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 -mx-4 md:-mx-6 px-4 md:px-6 py-6 mb-8 rounded-b-2xl shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!</h1>
        <p className="mt-1 text-primary-100">
          Here&apos;s an overview of your marketplace monitoring activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transform transition-all duration-200 hover:scale-105 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Active Searches</h3>
                <p className="text-3xl font-bold text-neutral-900">{stats.activeSearches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform transition-all duration-200 hover:scale-105 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Total Notifications</h3>
                <p className="text-3xl font-bold text-neutral-900">{stats.totalNotifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform transition-all duration-200 hover:scale-105 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Marketplaces</h3>
                <p className="text-3xl font-bold text-neutral-900">{stats.marketplacesCovered}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transform transition-all duration-200 hover:scale-105 hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-100 text-warning-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Avg. Relevance</h3>
                <p className="text-3xl font-bold text-neutral-900">{stats.averageRelevance}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Searches Section */}
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Searches</CardTitle>
              <Link href="/searches" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSearches.map((search) => (
                <div key={search.id} className="flex items-center justify-between rounded-md border border-neutral-200 bg-white p-4 transition-all hover:border-primary-200 hover:bg-primary-50">
                  <div>
                    <h4 className="font-medium text-neutral-900">{search.name}</h4>
                    <p className="text-sm text-neutral-500">
                      {search.count} matching items found
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="primary">{formatTimeAgo(search.lastUpdated)}</Badge>
                    <Link 
                      href={`/searches/${search.id}`}
                      className="rounded-md bg-neutral-100 p-2 text-neutral-700 hover:bg-neutral-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
              <div className="mt-4">
                <Link href="/searches/new">
                  <Button variant="outline" className="w-full group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create new search
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest Notifications Section */}
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Latest Notifications</CardTitle>
              <Link href="/notifications" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestResults.map((result) => (
                <div key={result.id} className="group flex items-start space-x-4 rounded-md border border-neutral-200 bg-white p-4 transition-all hover:border-primary-200 hover:bg-primary-50">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <div className="relative h-full w-full">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110" 
                        style={{ backgroundImage: `url(${result.image})` }} 
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="truncate font-medium text-neutral-900">{result.title}</h4>
                      <Badge variant="success">{result.relevanceScore}/10</Badge>
                    </div>
                    <p className="text-sm font-medium text-primary-700">${result.price.toFixed(2)}</p>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-neutral-500">
                      <Badge variant="primary">{result.marketplace}</Badge>
                      <span>{formatTimeAgo(result.createdAt)}</span>
                    </div>
                  </div>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 rounded-md bg-neutral-100 p-2 text-neutral-700 hover:bg-neutral-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Latest Results Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Latest Results</CardTitle>
            <Link href="/searches/results" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
              View all →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestResults.map((result) => (
              <SearchResultCard key={result.id} {...result} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/searches/results">
              <Button variant="outline" className="group">
                View all results
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Analysis Card */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-100">
        <CardHeader>
          <CardTitle>Your Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-lg mb-3">Price Trends</h4>
              <p className="text-neutral-700 mb-2">
                The average price for your saved items has <span className="text-success-600 font-medium">decreased by 5.2%</span> in the last 7 days.
              </p>
              <Link href="/analytics" className="text-primary-600 hover:text-primary-800 font-medium text-sm inline-flex items-center">
                View detailed analytics
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-3">Deal Alert</h4>
              <p className="text-neutral-700 mb-2">
                We&apos;ve found <span className="text-warning-600 font-medium">3 items</span> that are priced at least 20% below similar listings.
              </p>
              <Link href="/searches/results?sort=deals" className="text-primary-600 hover:text-primary-800 font-medium text-sm inline-flex items-center">
                View deals
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
