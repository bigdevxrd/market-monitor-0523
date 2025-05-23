'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { SearchTemplateService } from '@/lib/api/search-template-service';
import { SearchResult } from '@/types';
import { useAuth } from '@/lib/auth-context';

interface EnhancedSearchResultsPageProps {
  searchId?: string;
}

export default function EnhancedSearchResultsPage({ searchId }: EnhancedSearchResultsPageProps) {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSearch, setSavedSearch] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Dummy data for demonstration
  const [results, setResults] = useState<SearchResult[]>([
    {
      id: '1',
      title: 'Nike Air Max 90 Vintage 1990s OG Infrared US 9',
      price: 120,
      image: 'https://plus.unsplash.com/premium_photo-1682126149925-a1a298241996?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG5pa2UlMjBzbmVha2Vyc3xlbnwwfHwwfHx8MA%3D%3D',
      marketplace: 'Depop',
      relevanceScore: 9,
      url: '#',
      postedAt: new Date(Date.now() - 1800000),
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
      postedAt: new Date(Date.now() - 3600000),
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
      postedAt: new Date(Date.now() - 7200000),
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
      postedAt: new Date(Date.now() - 14400000),
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
      postedAt: new Date(Date.now() - 28800000),
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
      postedAt: new Date(Date.now() - 43200000),
      seller: { name: 'kicksupreme', rating: 4.9 },
      location: 'Atlanta, GA',
      condition: 'New',
    },
  ]);

  // Load saved search details
  useEffect(() => {
    if (!searchId || !user) return;
    
    const loadSavedSearch = async () => {
      setIsLoading(true);
      try {
        const searchTemplateService = new SearchTemplateService();
        // In a real app, you would fetch this from the database
        const search = await searchTemplateService.getSavedSearch(searchId);
        
        if (search) {
          setSavedSearch(search);
          
          // Initialize filters based on the search
          if (search.query.marketplaces?.length) {
            setSelectedMarketplaces(search.query.marketplaces);
          }
          
          if (search.query.minPrice !== undefined || search.query.maxPrice !== undefined) {
            setPriceRange([
              search.query.minPrice || 0,
              search.query.maxPrice || 1000
            ]);
          }
          
          if (search.query.condition) {
            setSelectedConditions(Array.isArray(search.query.condition) 
              ? search.query.condition 
              : [search.query.condition]);
          }
        }
      } catch (error) {
        console.error('Error loading saved search:', error);
        toast.error('Failed to load search details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedSearch();
  }, [searchId, user]);

  // Refresh search results
  const refreshResults = async () => {
    if (!searchId || !user) return;
    
    setIsRefreshing(true);
    try {
      const searchTemplateService = new SearchTemplateService();
      const { results: newResults } = await searchTemplateService.runSavedSearch(searchId);
      
      if (newResults && newResults.length > 0) {
        setResults(newResults);
        toast.success(`Found ${newResults.length} results`);
      } else {
        toast.info('No new results found');
      }
    } catch (error) {
      console.error('Error refreshing search results:', error);
      toast.error('Failed to refresh search results');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Save item to favorites
  const saveToFavorites = () => {
    toast.success('Item saved to favorites');
  };

  // Filter and sort the results
  const filteredResults = results.filter((result) => {
    // Text search
    if (searchQuery && !result.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by marketplace
    if (selectedMarketplaces.length > 0 && !selectedMarketplaces.includes(result.marketplace.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    if (result.price < priceRange[0] || result.price > priceRange[1]) {
      return false;
    }
    
    // Filter by condition
    if (selectedConditions.length > 0 && !selectedConditions.includes(result.condition?.toLowerCase() || '')) {
      return false;
    }
    
    // Predefined filters
    if (filter === 'high-relevance' && result.relevanceScore < 8) {
      return false;
    }
    if (filter === 'new' && result.condition !== 'New' && result.condition !== 'Like New') {
      return false;
    }
    if (filter === 'low-price' && result.price >= 100) {
      return false;
    }
    
    return true;
  });
  
  // Sort the filtered results
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'relevance') return b.relevanceScore - a.relevanceScore;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return b.postedAt.getTime() - a.postedAt.getTime();
    return 0;
  });

  return (
    <div className="container py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {savedSearch ? `"${savedSearch.name}" Results` : 'Search Results'}
          </h1>
          {savedSearch && (
            <p className="text-sm text-neutral-500">
              {savedSearch.query?.keywords}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
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
              Back
            </Button>
          </Link>
          
          {searchId && (
            <>
              <Button 
                variant="outline"
                onClick={refreshResults}
                loading={isRefreshing}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Refresh
              </Button>
              
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
            </>
          )}
          
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
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
              </div>
              
              <div className="w-full sm:w-auto">
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
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <h3 className="text-lg font-medium mb-3">Filters</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Marketplaces */}
                  <div>
                    <h4 className="font-medium mb-2">Marketplaces</h4>
                    <div className="flex flex-wrap gap-2">
                      {['depop', 'ebay', 'facebook', 'vinted', 'craigslist'].map((marketplace) => (
                        <button
                          key={marketplace}
                          type="button"
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                            selectedMarketplaces.includes(marketplace)
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                          }`}
                          onClick={() => {
                            if (selectedMarketplaces.includes(marketplace)) {
                              setSelectedMarketplaces(selectedMarketplaces.filter(m => m !== marketplace));
                            } else {
                              setSelectedMarketplaces([...selectedMarketplaces, marketplace]);
                            }
                          }}
                        >
                          {selectedMarketplaces.includes(marketplace) && (
                            <svg
                              className="-ml-0.5 mr-1.5 h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {marketplace.charAt(0).toUpperCase() + marketplace.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-24"
                      />
                      <span>to</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-24"
                      />
                    </div>
                  </div>
                  
                  {/* Condition */}
                  <div>
                    <h4 className="font-medium mb-2">Condition</h4>
                    <div className="flex flex-wrap gap-2">
                      {['new', 'like new', 'good', 'fair', 'poor'].map((condition) => (
                        <button
                          key={condition}
                          type="button"
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                            selectedConditions.includes(condition)
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                          }`}
                          onClick={() => {
                            if (selectedConditions.includes(condition)) {
                              setSelectedConditions(selectedConditions.filter(c => c !== condition));
                            } else {
                              setSelectedConditions([...selectedConditions, condition]);
                            }
                          }}
                        >
                          {selectedConditions.includes(condition) && (
                            <svg
                              className="-ml-0.5 mr-1.5 h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {condition.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedMarketplaces([]);
                      setPriceRange([0, 1000]);
                      setSelectedConditions([]);
                      setFilter('all');
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-neutral-500">
              {sortedResults.length} {sortedResults.length === 1 ? 'result' : 'results'} found
            </p>
            
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  filter === 'all' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-300'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  filter === 'high-relevance' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-neutral-700 hover:text-neutral-900 border-t border-b border-neutral-300'
                }`}
                onClick={() => setFilter('high-relevance')}
              >
                High Relevance
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  filter === 'new' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-neutral-700 hover:text-neutral-900 border-t border-b border-neutral-300'
                }`}
                onClick={() => setFilter('new')}
              >
                New
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  filter === 'low-price' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-300'
                }`}
                onClick={() => setFilter('low-price')}
              >
                Low Price
              </button>
            </div>
          </div>

          {sortedResults.length === 0 ? (
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
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedResults.map((result) => (
                <Card key={result.id} className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => saveToFavorites(result.id)}
                        className="p-1.5 bg-white rounded-full shadow hover:bg-neutral-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-neutral-500 hover:text-primary-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={
                        result.marketplace === 'Depop' ? 'primary' :
                        result.marketplace === 'eBay' ? 'warning' :
                        result.marketplace === 'Facebook' ? 'secondary' :
                        result.marketplace === 'Vinted' ? 'success' :
                        'error'
                      }>
                        {result.marketplace}
                      </Badge>
                      <div className="flex items-center">
                        <span className="text-sm text-neutral-500 mr-1">Relevance:</span>
                        <Badge variant={
                          result.relevanceScore >= 8 ? 'success' :
                          result.relevanceScore >= 6 ? 'warning' :
                          'default'
                        }>
                          {result.relevanceScore}/10
                        </Badge>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-neutral-900 mb-2 line-clamp-2">{result.title}</h3>
                    
                    <div className="text-xl font-bold text-primary-600 mb-3">${result.price.toFixed(2)}</div>
                    
                    <div className="flex flex-col space-y-1 text-sm text-neutral-500 mb-4">
                      {result.condition && (
                        <div className="flex items-center">
                          <span className="w-20 flex-shrink-0">Condition:</span>
                          <span>{result.condition}</span>
                        </div>
                      )}
                      {result.location && (
                        <div className="flex items-center">
                          <span className="w-20 flex-shrink-0">Location:</span>
                          <span>{result.location}</span>
                        </div>
                      )}
                      {result.seller?.name && (
                        <div className="flex items-center">
                          <span className="w-20 flex-shrink-0">Seller:</span>
                          <span className="flex items-center">
                            {result.seller.name}
                            {result.seller.rating && (
                              <span className="flex items-center ml-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-yellow-500"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                  />
                                </svg>
                                <span className="ml-0.5">{result.seller.rating}</span>
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="w-20 flex-shrink-0">Posted:</span>
                        <span>
                          {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                            Math.round((result.postedAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                            'day'
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="primary" fullWidth>
                        View Item
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
