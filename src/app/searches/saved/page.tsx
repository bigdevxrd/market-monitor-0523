'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth-context';
import { SearchTemplateService } from '@/lib/api/search-template-service';
import { SearchTemplate } from '@/types';

export default function SavedSearchesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState<SearchTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<string | null>(null);
  
  const searchTemplateService = new SearchTemplateService();
  
  // Load saved searches
  useEffect(() => {
    if (!user) return;
    
    const loadSavedSearches = async () => {
      setIsLoading(true);
      try {
        const searches = await searchTemplateService.getSavedSearches(user.id);
        setSavedSearches(searches);
      } catch (error) {
        console.error('Error loading saved searches:', error);
        toast.error('Failed to load saved searches');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedSearches();
  }, [user, searchTemplateService]);
  
  // Run a saved search
  const runSearch = async (searchId: string) => {
    setIsRunning(searchId);
    try {
      await searchTemplateService.runSavedSearch(searchId);
      router.push(`/searches/results?searchId=${searchId}`);
    } catch (error) {
      console.error('Error running search:', error);
      toast.error('Failed to run search');
      setIsRunning(null);
    }
  };
  
  // Delete a saved search
  const deleteSearch = async (searchId: string) => {
    if (!confirm('Are you sure you want to delete this saved search?')) return;
    
    setIsDeleting(searchId);
    try {
      await searchTemplateService.deleteSearch(searchId);
      setSavedSearches(savedSearches.filter(search => search.id !== searchId));
      toast.success('Search deleted successfully');
    } catch (error) {
      console.error('Error deleting search:', error);
      toast.error('Failed to delete search');
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Toggle notification for a search
  const toggleNotification = async (searchId: string, enabled: boolean) => {
    try {
      await searchTemplateService.updateSearch(searchId, { notification_enabled: enabled });
      
      // Update local state
      setSavedSearches(savedSearches.map(search => 
        search.id === searchId ? { ...search, notification_enabled: enabled } : search
      ));
      
      toast.success(enabled 
        ? 'Notifications enabled for this search' 
        : 'Notifications disabled for this search'
      );
    } catch (error) {
      console.error('Error updating search:', error);
      toast.error('Failed to update notification preferences');
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  // Get marketplace icons
  const getMarketplaceIcon = (marketplace: string) => {
    switch (marketplace.toLowerCase()) {
      case 'depop':
        return (
          <div className="h-6 w-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
            D
          </div>
        );
      case 'ebay':
        return (
          <div className="h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">
            E
          </div>
        );
      case 'facebook':
        return (
          <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            F
          </div>
        );
      case 'vinted':
        return (
          <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
            V
          </div>
        );
      case 'craigslist':
        return (
          <div className="h-6 w-6 rounded-full bg-neutral-600 flex items-center justify-center text-white text-xs font-bold">
            C
          </div>
        );
      default:
        return (
          <div className="h-6 w-6 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-700 text-xs font-bold">
            ?
          </div>
        );
    }
  };
  
  // Mock data for demonstration
  useEffect(() => {
    if (!user) return;
    
    // Only use mock data if no real data was loaded
    if (savedSearches.length > 0) return;
    
    const mockSearches: SearchTemplate[] = [
      {
        id: '1',
        user_id: user.id,
        name: 'Vintage Leather Jacket',
        query: {
          keywords: 'vintage leather jacket',
          minPrice: 50,
          maxPrice: 300,
          marketplaces: ['depop', 'ebay', 'facebook'],
          condition: ['good', 'like new', 'new']
        },
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        last_run: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notification_enabled: true
      },
      {
        id: '2',
        user_id: user.id,
        name: 'Nike Air Max 90',
        query: {
          keywords: 'nike air max 90 size 10',
          minPrice: 80,
          maxPrice: 150,
          marketplaces: ['depop', 'ebay', 'vinted'],
          condition: ['new', 'like new']
        },
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        last_run: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notification_enabled: true
      },
      {
        id: '3',
        user_id: user.id,
        name: 'Mechanical Keyboard',
        query: {
          keywords: 'mechanical keyboard cherry mx',
          minPrice: 40,
          maxPrice: 120,
          marketplaces: ['ebay', 'facebook', 'craigslist'],
          condition: ['good', 'like new', 'new']
        },
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        last_run: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        notification_enabled: false
      },
    ];
    
    setSavedSearches(mockSearches);
    setIsLoading(false);
  }, [user, savedSearches.length]);

  return (
    <div className="container py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4 sm:mb-0">Saved Searches</h1>
        
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
            Create New Search
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : savedSearches.length === 0 ? (
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
            <p className="mt-1 text-neutral-500">Create a new search to start monitoring items across marketplaces.</p>
            <div className="mt-6">
              <Link href="/searches/new">
                <Button>Create Your First Search</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedSearches.map((search) => (
            <Card key={search.id} className="overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={search.notification_enabled ? 'success' : 'default'}>
                    {search.notification_enabled ? 'Notifications On' : 'Notifications Off'}
                  </Badge>
                  <span className="text-xs text-neutral-500">
                    Created {formatDate(search.created_at).split(',')[0]}
                  </span>
                </div>
                <CardTitle className="text-lg">{search.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-4 flex-grow">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Keywords</h4>
                    <p className="text-neutral-900">{search.query.keywords}</p>
                  </div>
                  
                  {(search.query.minPrice !== undefined || search.query.maxPrice !== undefined) && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-1">Price Range</h4>
                      <p className="text-neutral-900">
                        {search.query.minPrice !== undefined ? `$${search.query.minPrice}` : '$0'} - {
                          search.query.maxPrice !== undefined ? `$${search.query.maxPrice}` : 'Any'
                        }
                      </p>
                    </div>
                  )}
                  
                  {search.query.marketplaces && search.query.marketplaces.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-1">Marketplaces</h4>
                      <div className="flex flex-wrap gap-2">
                        {search.query.marketplaces.map((marketplace, index) => (
                          <div key={index} className="flex items-center">
                            {getMarketplaceIcon(marketplace)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {search.query.condition && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500 mb-1">Condition</h4>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(search.query.condition) ? search.query.condition : [search.query.condition])
                          .filter((condition): condition is string => typeof condition === 'string')
                          .map((condition: string, index: number) => (
                            <Badge key={index} variant="outline" className="capitalize">
                              {condition}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-neutral-500 mb-1">Last Run</h4>
                    <p className="text-neutral-900">{search.last_run ? formatDate(search.last_run) : 'Never'}</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 flex-shrink-0">
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button
                    variant="primary"
                    isLoading={isRunning === search.id}
                    onClick={() => runSearch(search.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Run Search
                  </Button>
                  
                  <div className="relative dropdown dropdown-end">
                    <Button variant="outline" className="w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      Options
                    </Button>
                    <ul className="dropdown-menu absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <li>
                        <button
                          onClick={() => toggleNotification(search.id, !search.notification_enabled)}
                          className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          {search.notification_enabled ? 'Disable Notifications' : 'Enable Notifications'}
                        </button>
                      </li>
                      <li>
                        <Link
                          href={`/searches/edit/${search.id}`}
                          className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                        >
                          Edit Search
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => deleteSearch(search.id)}
                          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-neutral-100"
                          disabled={isDeleting === search.id}
                        >
                          {isDeleting === search.id ? 'Deleting...' : 'Delete Search'}
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
