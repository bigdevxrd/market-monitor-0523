'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

interface Search {
  id: string;
  name: string;
  keywords: string;
  createdAt: Date;
  lastUpdated: Date;
  totalMatches: number;
  newMatches: number;
  marketplaces: string[];
  active: boolean;
}

export default function SearchesPage() {
  // Dummy data for demonstration
  const [searches, setSearches] = useState<Search[]>([
    {
      id: '1',
      name: 'Vintage Nike Sneakers',
      keywords: 'Nike Air Max 90 vintage retro',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      totalMatches: 47,
      newMatches: 3,
      marketplaces: ['depop', 'ebay', 'facebook'],
      active: true,
    },
    {
      id: '2',
      name: 'Canon EOS Camera',
      keywords: 'Canon EOS 5D DSLR camera',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000),
      totalMatches: 29,
      newMatches: 0,
      marketplaces: ['ebay', 'facebook', 'craigslist'],
      active: true,
    },
    {
      id: '3',
      name: 'Mid Century Coffee Table',
      keywords: 'mid century modern coffee table wood',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000),
      totalMatches: 18,
      newMatches: 2,
      marketplaces: ['facebook', 'craigslist', 'vinted'],
      active: true,
    },
    {
      id: '4',
      name: 'Vintage Leather Jacket',
      keywords: 'vintage leather jacket brown bomber',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      totalMatches: 72,
      newMatches: 0,
      marketplaces: ['depop', 'vinted', 'ebay'],
      active: false,
    },
  ]);

  const toggleSearchActive = (searchId: string) => {
    setSearches((prev) =>
      prev.map((search) =>
        search.id === searchId ? { ...search, active: !search.active } : search
      )
    );
    
    const search = searches.find((s) => s.id === searchId);
    toast.success(`Search ${search?.active ? 'paused' : 'activated'}: ${search?.name}`);
  };

  const deleteSearch = (searchId: string) => {
    const search = searches.find((s) => s.id === searchId);
    
    if (confirm(`Are you sure you want to delete the search: ${search?.name}?`)) {
      setSearches((prev) => prev.filter((search) => search.id !== searchId));
      toast.success(`Search deleted: ${search?.name}`);
    }
  };

  const getMarketplaceIcon = (marketplace: string) => {
    switch (marketplace) {
      case 'depop':
        return (
          <Badge variant="primary" className="mr-1">
            Depop
          </Badge>
        );
      case 'ebay':
        return (
          <Badge variant="warning" className="mr-1">
            eBay
          </Badge>
        );
      case 'facebook':
        return (
          <Badge variant="secondary" className="mr-1">
            FB
          </Badge>
        );
      case 'vinted':
        return (
          <Badge variant="success" className="mr-1">
            Vinted
          </Badge>
        );
      case 'craigslist':
        return (
          <Badge variant="error" className="mr-1">
            CL
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Saved Searches</h1>
        <Link href="/searches/new">
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Search
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {searches.map((search) => (
          <Card key={search.id} className={!search.active ? 'opacity-70' : ''}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-neutral-900 mr-2">{search.name}</h3>
                    {search.newMatches > 0 && (
                      <Badge variant="success" className="rounded-full">
                        {search.newMatches} new
                      </Badge>
                    )}
                    {!search.active && (
                      <Badge variant="default" className="ml-2">
                        Paused
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">&quot;{search.keywords}&quot;</p>
                  <div className="mt-2 flex flex-wrap items-center">
                    <div className="mr-4 flex items-center text-sm text-neutral-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Updated {formatTimeAgo(search.lastUpdated)}
                    </div>
                    <div className="flex items-center text-sm text-neutral-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {search.totalMatches} total matches
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-1">
                    {search.marketplaces.map((marketplace) => (
                      <span key={marketplace}>{getMarketplaceIcon(marketplace)}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:mt-0 sm:flex-row sm:space-x-3">
                  <Link href={`/searches/${search.id}`}>
                    <Button variant="outline" size="sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1.5 h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View Results
                    </Button>
                  </Link>
                  <Link href={`/searches/edit/${search.id}`}>
                    <Button variant="outline" size="sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1.5 h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSearchActive(search.id)}
                  >
                    {search.active ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1.5 h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1.5 h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSearch(search.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1.5 h-4 w-4 text-error-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {searches.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
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
                  strokeWidth={1}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-neutral-900">No saved searches</h3>
              <p className="mt-1 text-neutral-500">Create your first search to start monitoring marketplaces.</p>
              <Link href="/searches/new" className="mt-4">
                <Button>Create New Search</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
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
