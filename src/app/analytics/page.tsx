'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnalyticsService } from '@/lib/api/analytics-service';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Select from '@/components/ui/Select';
import { LineChart } from '@/components/ui/charts/LineChart';
import { BarChart } from '@/components/ui/charts/BarChart';
import { PieChart } from '@/components/ui/charts/PieChart';
import { PriceTrend, SearchAnalytics, MarketplaceDistribution } from '@/types';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalytics | null>(null);
  const [priceTrends, setPriceTrends] = useState<PriceTrend[]>([]);
  const [marketplaceDistribution, setMarketplaceDistribution] = useState<MarketplaceDistribution[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const productsToTrack = [
    'vintage leather jacket',
    'nike air max 90',
    'mechanical keyboard',
    'bluetooth headphones',
    'vintage camera'
  ];

  useEffect(() => {
    if (!user) return;
    
    const analyticsService = new AnalyticsService();
    
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Fetch data in parallel using Promise.all
        const [analytics, trends, distribution] = await Promise.all([
          analyticsService.getUserSearchAnalytics(user.id),
          analyticsService.getPriceTrends(selectedProduct, timeRange),
          analyticsService.getMarketplaceDistribution(user.id)
        ]);
        
        setSearchAnalytics(analytics);
        setPriceTrends(trends);
        setMarketplaceDistribution(distribution);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [user, timeRange, selectedProduct]);

  // For the mock data, generate price trends based on the selected time range
  useEffect(() => {
    if (!selectedProduct) return;
    
    // Generate mock price trend data
    const generateMockPriceTrends = () => {
      const today = new Date();
      const data: PriceTrend[] = [];
      
      // Decide on data points based on time range
      const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
      const interval = timeRange === 'week' ? 1 : timeRange === 'month' ? 3 : 30;
      
      // Generate data points
      for (let i = days; i >= 0; i -= interval) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        // Generate a price with some variation
        const basePrice = selectedProduct === 'all' ? 150 : 
                        selectedProduct === 'vintage leather jacket' ? 200 :
                        selectedProduct === 'nike air max 90' ? 120 :
                        selectedProduct === 'mechanical keyboard' ? 80 :
                        selectedProduct === 'bluetooth headphones' ? 65 : 100;
        
        // Add some random variation
        const randomVariation = Math.sin(i/10) * 20 + Math.random() * 15 - 7.5;
        const price = Math.max(basePrice + randomVariation, basePrice * 0.7);
        
        data.push({
          date: date.toISOString().split('T')[0],
          avgPrice: Math.round(price),
          minPrice: Math.round(price * 0.85),
          maxPrice: Math.round(price * 1.15),
          numItems: Math.floor(Math.random() * 50) + 10
        });
      }
      
      return data;
    };
    
    setPriceTrends(generateMockPriceTrends());
  }, [selectedProduct, timeRange]);

  // Generate mock data for marketplace distribution
  useEffect(() => {
    const mockDistribution = [
      { marketplace: 'Depop', count: 156, percentage: 32 },
      { marketplace: 'eBay', count: 203, percentage: 42 },
      { marketplace: 'Facebook', count: 87, percentage: 18 },
      { marketplace: 'Vinted', count: 25, percentage: 5 },
      { marketplace: 'Craigslist', count: 15, percentage: 3 }
    ];
    
    setMarketplaceDistribution(mockDistribution);
  }, []);

  // Generate mock search analytics data
  useEffect(() => {
    const mockSearchAnalytics = {
      totalSearches: 542,
      recentSearches: [
        { query: 'vintage leather jacket', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
        { query: 'nike air max 90 size 10', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
        { query: 'mechanical keyboard cherry mx', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
        { query: 'bluetooth headphones noise cancelling', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
        { query: 'vintage camera polaroid', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() }
      ],
      topKeywords: [
        { keyword: 'vintage', count: 78 },
        { keyword: 'nike', count: 67 },
        { keyword: 'leather', count: 52 },
        { keyword: 'mechanical', count: 44 },
        { keyword: 'keyboard', count: 41 },
        { keyword: 'bluetooth', count: 37 },
        { keyword: 'headphones', count: 32 },
        { keyword: 'camera', count: 29 },
        { keyword: 'jacket', count: 28 },
        { keyword: 'polaroid', count: 25 }
      ]
    };
    
    setSearchAnalytics(mockSearchAnalytics);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: timeRange === 'year' ? 'numeric' : undefined
    }).format(date);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Searches</CardTitle>
            <CardDescription>All-time search history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{searchAnalytics?.totalSearches || 0}</p>
            <p className="text-sm text-neutral-500 mt-2">Across all connected marketplaces</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Marketplaces Used</CardTitle>
            <CardDescription>Distribution of search results</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{marketplaceDistribution.length}</p>
            <p className="text-sm text-neutral-500 mt-2">eBay is your most active marketplace</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saved Searches</CardTitle>
            <CardDescription>Active search monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12</p>
            <p className="text-sm text-neutral-500 mt-2">7 with notifications enabled</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="priceTrends" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="priceTrends">Price Trends</TabsTrigger>
          <TabsTrigger value="searchHistory">Search History</TabsTrigger>
          <TabsTrigger value="marketplaceAnalysis">Marketplace Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="priceTrends">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Price Trends Over Time</CardTitle>
                  <CardDescription>Track how prices change over time</CardDescription>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <Select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Products' },
                      ...productsToTrack.map(product => ({
                        value: product,
                        label: product.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                      }))
                    ]}
                  />
                  <Select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
                    options={[
                      { value: 'week', label: 'Last Week' },
                      { value: 'month', label: 'Last Month' },
                      { value: 'year', label: 'Last Year' },
                    ]}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  data={priceTrends.map(trend => ({
                    x: formatDate(trend.date),
                    'Average Price': trend.avgPrice,
                    'Min Price': trend.minPrice,
                    'Max Price': trend.maxPrice
                  }))}
                  xAxis={priceTrends.map(trend => formatDate(trend.date))}
                  yLabel="Price ($)"
                  colors={['#4F46E5', '#10B981', '#F59E0B']}
                  tooltipFormat={(value) => `$${value}`}
                />
              </div>
              
              <div className="mt-8 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Current Avg. Price</p>
                  <p className="text-xl font-bold">${priceTrends[priceTrends.length - 1]?.avgPrice || 0}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Lowest Price</p>
                  <p className="text-xl font-bold">${Math.min(...(priceTrends.map(t => t.minPrice) || [0]))}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Highest Price</p>
                  <p className="text-xl font-bold">${Math.max(...(priceTrends.map(t => t.maxPrice) || [0]))}</p>
                </div>
                <div>
                  <p className="text-neutral-500">30-Day Trend</p>
                  {priceTrends.length > 2 && (
                    <p className={`text-xl font-bold ${
                      priceTrends[priceTrends.length - 1].avgPrice > priceTrends[0].avgPrice
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}>
                      {priceTrends[priceTrends.length - 1].avgPrice > priceTrends[0].avgPrice
                        ? '↑'
                        : '↓'} 
                      {Math.abs(
                        Math.round(
                          ((priceTrends[priceTrends.length - 1].avgPrice - priceTrends[0].avgPrice) / priceTrends[0].avgPrice) * 100
                        )
                      )}%
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="searchHistory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Searches</CardTitle>
                <CardDescription>Your latest search queries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchAnalytics?.recentSearches.map((search, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b border-neutral-200 last:border-0">
                      <div>
                        <p className="font-medium">{search.query}</p>
                        <p className="text-sm text-neutral-500">{formatTimestamp(search.timestamp)}</p>
                      </div>
                      <Button variant="outline" size="sm">Run Again</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Search Keywords</CardTitle>
                <CardDescription>Most frequently used terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <BarChart
                    data={searchAnalytics?.topKeywords.map(kw => ({
                      x: kw.keyword,
                      Frequency: kw.count
                    })) || []}
                    xAxis={(searchAnalytics?.topKeywords.map(kw => kw.keyword) || []).slice(0, 10)}
                    yLabel="Frequency"
                    colors={['#4F46E5']}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="marketplaceAnalysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Distribution</CardTitle>
                <CardDescription>Where your items are found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart
                    data={marketplaceDistribution.map(item => ({
                      label: item.marketplace,
                      value: item.count
                    }))}
                    colors={['#4F46E5', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6']}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Breakdown</CardTitle>
                <CardDescription>Items found by marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketplaceDistribution.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-32 sm:w-40 mr-4">
                        <p className="font-medium truncate">{item.marketplace}</p>
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-neutral-200 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: index === 0 ? '#4F46E5' : 
                                             index === 1 ? '#F59E0B' : 
                                             index === 2 ? '#10B981' : 
                                             index === 3 ? '#EF4444' : '#8B5CF6'
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-20 ml-4 text-right">
                        <p className="font-medium">{item.count} items</p>
                        <p className="text-xs text-neutral-500">{item.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <h4 className="font-medium mb-4">Best Marketplace by Category</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <p className="text-neutral-500">Lowest Prices</p>
                      <p className="font-bold">Facebook Marketplace</p>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <p className="text-neutral-500">Most Inventory</p>
                      <p className="font-bold">eBay</p>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <p className="text-neutral-500">Fastest Response</p>
                      <p className="font-bold">Depop</p>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <p className="text-neutral-500">Best Condition</p>
                      <p className="font-bold">Vinted</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Price Drop Recommendations</CardTitle>
          <CardDescription>When to buy based on historical prices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 mr-4 rounded-md overflow-hidden bg-neutral-100">
                  <Image 
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" 
                    alt="Nike Air Max 90" 
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Nike Air Max 90</h3>
                  <p className="text-sm text-neutral-500">Current Avg: $120</p>
                </div>
              </div>
              <div className="flex flex-col md:items-end">
                <p className="text-green-600 font-bold">▼ Prices typically drop 15% in July</p>
                <p className="text-sm text-neutral-500">Based on 2-year historical data</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 mr-4 rounded-md overflow-hidden bg-neutral-100">
                  <Image 
                    src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea" 
                    alt="Vintage Leather Jacket" 
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Vintage Leather Jacket</h3>
                  <p className="text-sm text-neutral-500">Current Avg: $200</p>
                </div>
              </div>
              <div className="flex flex-col md:items-end">
                <p className="text-red-600 font-bold">▲ Prices trending up 8% month-over-month</p>
                <p className="text-sm text-neutral-500">Buy soon to avoid higher prices</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 mr-4 rounded-md overflow-hidden bg-neutral-100">
                  <Image 
                    src="https://images.unsplash.com/photo-1626197031507-c17099753214" 
                    alt="Mechanical Keyboard" 
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">Mechanical Keyboard</h3>
                  <p className="text-sm text-neutral-500">Current Avg: $85</p>
                </div>
              </div>
              <div className="flex flex-col md:items-end">
                <p className="text-amber-600 font-bold">→ Prices stable with occasional flash sales</p>
                <p className="text-sm text-neutral-500">Set notifications for deals under $70</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
