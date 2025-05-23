'use client';

import { useState, useEffect } from 'react';
import { AnalyticsService } from '@/lib/api/analytics-service';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Select from '@/components/ui/Select';
import { LineChart } from '@/components/ui/charts/LineChart';
import { BarChart } from '@/components/ui/charts/BarChart';
import { PieChart } from '@/components/ui/charts/PieChart';
import { PriceTrend, SearchAnalytics } from '@/types';

export function AnalyticsDashboard() {
  const { user } = useAuth();
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalytics | null>(null);
  const [priceTrends, setPriceTrends] = useState<PriceTrend[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('vintage leather jacket');
  const [marketplaceDistribution, setMarketplaceDistribution] = useState<{marketplace: string, count: number}[]>([]);
  
  const analyticsService = new AnalyticsService();
  
  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const analytics = await analyticsService.getUserSearchAnalytics(user.id);
        const distribution = await analyticsService.getMarketplaceDistribution(user.id);
        
        setSearchAnalytics(analytics);
        setMarketplaceDistribution(distribution);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [user?.id, user, analyticsService]);
  
  // Fetch price trends when search query or time range changes
  useEffect(() => {
    const fetchPriceTrends = async () => {
      if (!searchQuery) return;
      
      try {
        const trends = await analyticsService.getPriceTrends(searchQuery, timeRange);
        setPriceTrends(trends);
      } catch (error) {
        console.error('Error fetching price trends:', error);
      }
    };
    
    fetchPriceTrends();
  }, [searchQuery, timeRange, analyticsService]);
  
  // Prepare data for charts
  const prepareLineChartData = () => {
    return {
      labels: priceTrends.map(trend => trend.date),
      datasets: [
        {
          label: 'Avg Price',
          data: priceTrends.map(trend => trend.avgPrice),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Min Price',
          data: priceTrends.map(trend => trend.minPrice),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Max Price',
          data: priceTrends.map(trend => trend.maxPrice),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    };
  };
  
  const prepareBarChartData = () => {
    if (!searchAnalytics) return { labels: [], datasets: [] };
    
    return {
      labels: searchAnalytics.topKeywords.map(k => k.keyword),
      datasets: [
        {
          label: 'Search Count',
          data: searchAnalytics.topKeywords.map(k => k.count),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
      ]
    };
  };
  
  const preparePieChartData = () => {
    return {
      labels: marketplaceDistribution.map(item => item.marketplace),
      datasets: [
        {
          data: marketplaceDistribution.map(item => item.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  
  if (isLoading) {
    return <div>Loading analytics...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${activeTab === 'overview' ? 'bg-primary-100 text-primary-800' : 'text-neutral-600'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${activeTab === 'price-trends' ? 'bg-primary-100 text-primary-800' : 'text-neutral-600'}`}
              onClick={() => setActiveTab('price-trends')}
            >
              Price Trends
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${activeTab === 'search-history' ? 'bg-primary-100 text-primary-800' : 'text-neutral-600'}`}
              onClick={() => setActiveTab('search-history')}
            >
              Search History
            </button>
          </TabsList>
          
          {activeTab === 'price-trends' && (
            <div className="flex items-center gap-4">
              <Select
                options={[
                  { value: 'vintage leather jacket', label: 'Vintage Leather Jacket' },
                  { value: 'mechanical keyboard', label: 'Mechanical Keyboard' },
                  { value: "levi's 501", label: "Levi's 501" },
                  { value: 'polaroid camera', label: 'Polaroid Camera' }
                ]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[240px]"
              />
              
              <Select
                options={[
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                  { value: 'year', label: 'Year' }
                ]}
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
                className="w-[120px]"
              />
            </div>
          )}
        </div>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Searches</CardTitle>
                <CardDescription>All-time search count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{searchAnalytics?.totalSearches || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Recent Searches</CardTitle>
                <CardDescription>Number of searches in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {searchAnalytics?.recentSearches.filter(s => {
                    const searchDate = new Date(s.timestamp);
                    const now = new Date();
                    const weekAgo = new Date();
                    weekAgo.setDate(now.getDate() - 7);
                    return searchDate >= weekAgo;
                  }).length || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Unique Search Terms</CardTitle>
                <CardDescription>Number of different search terms used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {searchAnalytics?.topKeywords.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Search Keywords</CardTitle>
                <CardDescription>Your most frequently used search terms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart data={prepareBarChartData()} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Distribution</CardTitle>
                <CardDescription>Your item views by marketplace</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChart data={preparePieChartData()} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="price-trends" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Trends for &quot;{searchQuery}&quot;</CardTitle>
              <CardDescription>
                Track how prices have changed over the {timeRange}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <LineChart data={prepareLineChartData()} />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Current Avg. Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${priceTrends[priceTrends.length - 1]?.avgPrice.toFixed(2) || '0.00'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Price Change</CardTitle>
              </CardHeader>
              <CardContent>
                {priceTrends.length > 1 && (
                  <div className={`text-2xl font-bold ${
                    priceTrends[priceTrends.length - 1].avgPrice > priceTrends[0].avgPrice
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}>
                    {priceTrends[priceTrends.length - 1].avgPrice > priceTrends[0].avgPrice ? '+' : ''}
                    {((priceTrends[priceTrends.length - 1].avgPrice - priceTrends[0].avgPrice) / priceTrends[0].avgPrice * 100).toFixed(1)}%
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Best Recent Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  ${Math.min(...priceTrends.slice(-7).map(t => t.minPrice)).toFixed(2)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Available Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {priceTrends[priceTrends.length - 1]?.itemCount || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="search-history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Search History</CardTitle>
              <CardDescription>Your most recent searches across all marketplaces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {searchAnalytics?.recentSearches.map((search, index) => (
                  <div key={index} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{search.query.keywords}</p>
                      <p className="text-sm text-muted-foreground">
                        {search.query.marketplaces?.join(', ')}
                        {search.query.minPrice !== undefined && search.query.maxPrice !== undefined && 
                          ` • $${search.query.minPrice} - $${search.query.maxPrice}`}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(search.timestamp).toLocaleDateString()} {new Date(search.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                
                {(!searchAnalytics?.recentSearches.length) && (
                  <div className="py-8 text-center text-muted-foreground">
                    No recent searches found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
