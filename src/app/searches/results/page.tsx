'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import SearchResultCard from '@/components/ui/SearchResultCard';

interface SearchResultsPageProps {
  searchId?: string;
}

export default function SearchResultsPage({ searchId }: SearchResultsPageProps) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy data for demonstration
  const [results] = useState([
    {
      id: '1',
      title: 'Nike Air Max 90 Vintage 1990s OG Infrared US 9',
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
      id: '2',
      title: 'Nike Air Max 90 Essential Black White Men\'s Size 10',
      price: 95,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlrZXxlbnwwfHwwfHx8MA%3D%3D',
      marketplace: 'eBay',
      relevanceScore: 7,
      url: '#',
      createdAt: new Date(Date.now() - 3600000),
      seller: { name: 'sneakerdealer', rating: 4.9 },
      location: 'New York, NY',
      condition: 'New',
    },
    {
      id: '3',
      title: 'Vintage Nike Air Max 95 OG Neon Yellow 2003 Release',
      price: 175,
      image: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmlrZXxlbnwwfHwwfHx8MA%3D%3D',
      marketplace: 'Facebook',
      relevanceScore: 8,
      url: '#',
      createdAt: new Date(Date.now() - 7200000),
      seller: { name: 'retrorunner' },
      location: 'Chicago, IL',
      condition: 'Good',
    },
    {
      id: '4',
      title: 'Nike Air Max 97 Silver Bullet 2022 Release Size 9.5',
      price: 145,
      image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmlrZSUyMHNob2V8ZW58MHx8MHx8fDA%3D',
      marketplace: 'Vinted',
      relevanceScore: 6,
      url: '#',
      createdAt: new Date(Date.now() - 14400000),
      seller: { name: 'shoereseller', rating: 4.5 },
      location: 'Miami, FL',
      condition: 'Like New',
    },
    {
      id: '5',
      title: 'Vintage Nike Windbreaker Jacket 90s Swoosh Red/Blue XL',
      price: 65,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5pa2V8ZW58MHx8MHx8fDA%3D',
      marketplace: 'Depop',
      relevanceScore: 5,
      url: '#',
      createdAt: new Date(Date.now() - 28800000),
      seller: { name: 'vintagevault', rating: 4.6 },
      location: 'Portland, OR',
      condition: 'Good',
    },
    {
      id: '6',
      title: 'Nike Dunk Low Retro Panda Black White 2023 Men\'s 10.5',
      price: 110,
      image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG5pa2UlMjBzaG9lfGVufDB8fDB8fHww',
      marketplace: 'eBay',
      relevanceScore: 7,
      url: '#',
      createdAt: new Date(Date.now() - 43200000),
      seller: { name: 'kicksupreme', rating: 4.9 },
      location: 'Atlanta, GA',
      condition: 'New',
    },
  ]);

  // Filter and sort the results
  const filteredResults = results.filter((result) => {
    if (filter === 'all') return true;
    if (filter === 'high-relevance') return result.relevanceScore >= 8;
    if (filter === 'new') return result.condition === 'New' || result.condition === 'Like New';
    if (filter === 'low-price') return result.price < 100;
    
    // Text search
    if (searchQuery) {
      return result.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });
  
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'relevance') return b.relevanceScore - a.relevanceScore;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return b.createdAt.getTime() - a.createdAt.getTime();
    return 0;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4 md:mb-0">Search Results</h1>
        <div className="flex space-x-2">
          <Link href="/searches">
            <Button variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Searches
            </Button>
          </Link>
          {searchId && (
            <Link href={`/searches/edit/${searchId}`}>
              <Button variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Search
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              placeholder="Search in results..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg
                  className="h-5 w-5 text-neutral-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Results' },
                { value: 'high-relevance', label: 'High Relevance (8+)' },
                { value: 'new', label: 'New Condition' },
                { value: 'low-price', label: 'Low Price (<$100)' },
              ]}
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'relevance', label: 'Sort by: Relevance' },
                { value: 'price-low', label: 'Sort by: Price (Low to High)' },
                { value: 'price-high', label: 'Sort by: Price (High to Low)' },
                { value: 'newest', label: 'Sort by: Newest' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedResults.map((result) => (
          <SearchResultCard key={result.id} {...result} />
        ))}
      </div>

      {sortedResults.length === 0 && (
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
            <h3 className="mt-4 text-lg font-medium text-neutral-900">No results found</h3>
            <p className="mt-1 text-neutral-500">Try adjusting your filters or search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
