'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface MarketplaceStatus {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'inactive' | 'error';
  isConnected: boolean;
  lastUpdated?: Date;
  itemCount?: number;
}

export default function MarketplacesPage() {
  const [marketplaces, setMarketplaces] = useState<MarketplaceStatus[]>([
    {
      id: 'depop',
      name: 'Depop',
      icon: '🛍️',
      status: 'active',
      isConnected: true,
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      itemCount: 12500,
    },
    {
      id: 'ebay',
      name: 'eBay',
      icon: '📦',
      status: 'active',
      isConnected: true,
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
      itemCount: 54320,
    },
    {
      id: 'vinted',
      name: 'Vinted',
      icon: '👕',
      status: 'active',
      isConnected: true,
      lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000),
      itemCount: 8765,
    },
    {
      id: 'facebook',
      name: 'Facebook Marketplace',
      icon: '👥',
      status: 'inactive',
      isConnected: false,
    },
    {
      id: 'craigslist',
      name: 'Craigslist',
      icon: '📝',
      status: 'error',
      isConnected: true,
      lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ]);
  
  const [isRefreshing, setIsRefreshing] = useState<Record<string, boolean>>({});
  
  const toggleConnection = (marketplaceId: string) => {
    setMarketplaces(prev => 
      prev.map(marketplace => {
        if (marketplace.id === marketplaceId) {
          const isConnected = !marketplace.isConnected;
          const status = isConnected ? 'active' : 'inactive';
          
          toast.success(
            isConnected 
              ? `Connected to ${marketplace.name} successfully!` 
              : `Disconnected from ${marketplace.name}`
          );
          
          return {
            ...marketplace,
            isConnected,
            status,
            lastUpdated: isConnected ? new Date() : marketplace.lastUpdated,
          };
        }
        return marketplace;
      })
    );
  };
  
  const refreshMarketplace = (marketplaceId: string) => {
    setIsRefreshing(prev => ({ ...prev, [marketplaceId]: true }));
    
    // Simulate API call with a delay
    setTimeout(() => {
      setMarketplaces(prev => 
        prev.map(marketplace => {
          if (marketplace.id === marketplaceId) {
            // Generate a random change to item count for demo purposes
            const change = Math.floor(Math.random() * 100) - 30;
            const newCount = (marketplace.itemCount || 0) + change;
            
            toast.success(
              `${marketplace.name} refreshed successfully! ${change > 0 ? '+' : ''}${change} items.`
            );
            
            return {
              ...marketplace,
              lastUpdated: new Date(),
              itemCount: Math.max(0, newCount),
            };
          }
          return marketplace;
        })
      );
      
      setIsRefreshing(prev => ({ ...prev, [marketplaceId]: false }));
    }, 2000);
  };
  
  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Marketplaces</h1>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => {
              // Implement add new marketplace integration
              toast.success('Marketplace integrations coming soon!');
            }}
          >
            Add Marketplace
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketplaces.map(marketplace => (
          <Card key={marketplace.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{marketplace.icon}</span>
                  <CardTitle>{marketplace.name}</CardTitle>
                </div>
                <Badge 
                  variant={
                    marketplace.status === 'active' 
                      ? 'success' 
                      : marketplace.status === 'error' 
                        ? 'destructive' 
                        : 'secondary'
                  }
                >
                  {marketplace.status === 'active' 
                    ? 'Active' 
                    : marketplace.status === 'error' 
                      ? 'Error' 
                      : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-neutral-500">Status</p>
                  <p className="font-medium">
                    {marketplace.isConnected 
                      ? 'Connected' 
                      : 'Not connected'}
                  </p>
                </div>
                
                {marketplace.lastUpdated && (
                  <div>
                    <p className="text-sm text-neutral-500">Last Updated</p>
                    <p className="font-medium">
                      {marketplace.lastUpdated.toLocaleString()}
                    </p>
                  </div>
                )}
                
                {marketplace.itemCount !== undefined && (
                  <div>
                    <p className="text-sm text-neutral-500">Items Indexed</p>
                    <p className="font-medium">
                      {marketplace.itemCount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => toggleConnection(marketplace.id)}
              >
                {marketplace.isConnected ? 'Disconnect' : 'Connect'}
              </Button>
              
              {marketplace.isConnected && (
                <Button
                  onClick={() => refreshMarketplace(marketplace.id)}
                  loading={isRefreshing[marketplace.id]}
                  disabled={isRefreshing[marketplace.id]}
                >
                  Refresh
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Marketplace Settings</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Global Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Update Frequency</h3>
              <div className="flex items-center space-x-4">
                <select className="select select-bordered w-full max-w-xs">
                  <option value="5">Every 5 minutes</option>
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                  <option value="60" selected>Every hour</option>
                  <option value="240">Every 4 hours</option>
                  <option value="720">Every 12 hours</option>
                </select>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Default Search Settings</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="checkbox checkbox-primary" id="includeShipping" checked />
                  <label htmlFor="includeShipping">Include shipping cost in price filters</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="checkbox checkbox-primary" id="excludeSold" checked />
                  <label htmlFor="excludeSold">Exclude sold items</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="checkbox checkbox-primary" id="onlyVerified" />
                  <label htmlFor="onlyVerified">Only show verified sellers</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">API Rate Limiting</h3>
              <div className="flex items-center space-x-4">
                <select className="select select-bordered w-full max-w-xs">
                  <option value="low">Low (conserve API usage)</option>
                  <option value="medium" selected>Medium (balanced)</option>
                  <option value="high">High (faster updates)</option>
                </select>
              </div>
              <p className="text-sm text-neutral-500 mt-2">
                Higher rate limits may result in more accurate and frequent updates, but could lead to temporary IP blocks from certain marketplaces.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => toast.success('Settings saved!')}>
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
