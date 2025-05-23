import { createClient } from '@supabase/supabase-js';
import { SearchAnalytics, UserAnalytics, PriceTrend } from '@/types';

export class AnalyticsService {
  private supabase;
  
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  // Record user search
  async recordSearch(userId: string, searchQuery: any, resultsCount: number): Promise<void> {
    try {
      const searchEntry = {
        user_id: userId,
        query: searchQuery,
        results_count: resultsCount,
        timestamp: new Date().toISOString(),
      };
      
      await this.supabase
        .from('search_history')
        .insert([searchEntry]);
    } catch (error) {
      console.error('Error recording search:', error);
    }
  }
  
  // Get search analytics for a user
  async getUserSearchAnalytics(userId: string): Promise<SearchAnalytics> {
    try {
      // Get total searches
      const { count: totalSearches } = await this.supabase
        .from('search_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      // Get most searched keywords
      const { data: recentSearches } = await this.supabase
        .from('search_history')
        .select('query, timestamp')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(10);
      
      // Calculate most common search keywords
      let keywordMap = new Map<string, number>();
      recentSearches?.forEach(search => {
        const keywords = search.query.keywords;
        if (keywords) {
          if (keywordMap.has(keywords)) {
            keywordMap.set(keywords, keywordMap.get(keywords)! + 1);
          } else {
            keywordMap.set(keywords, 1);
          }
        }
      });
      
      const topKeywords = Array.from(keywordMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([keyword, count]) => ({ keyword, count }));
      
      return {
        totalSearches: totalSearches || 0,
        recentSearches: recentSearches || [],
        topKeywords,
      };
    } catch (error) {
      console.error('Error getting user search analytics:', error);
      return {
        totalSearches: 0,
        recentSearches: [],
        topKeywords: [],
      };
    }
  }
  
  // Get price trends for a specific search query over time
  async getPriceTrends(searchQuery: string, timeRange: 'week' | 'month' | 'year' = 'month'): Promise<PriceTrend[]> {
    try {
      // In a real implementation, this would query a database of historical price data
      // For demo purposes, we'll return mock data
      const now = new Date();
      const trends: PriceTrend[] = [];
      
      let days = 30; // Default to month
      if (timeRange === 'week') days = 7;
      if (timeRange === 'year') days = 365;
      
      // Generate mock price trend data
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        
        trends.push({
          date: date.toISOString().split('T')[0],
          avgPrice: 50 + Math.random() * 20, // Random price between 50-70
          minPrice: 40 + Math.random() * 10, // Random min between 40-50
          maxPrice: 70 + Math.random() * 30, // Random max between 70-100
          itemCount: Math.floor(10 + Math.random() * 30), // Random count between 10-40
        });
      }
      
      return trends;
    } catch (error) {
      console.error('Error getting price trends:', error);
      return [];
    }
  }
  
  // Get overall user analytics (for admins)
  async getUserAnalytics(): Promise<UserAnalytics> {
    try {
      // In a production app, this would include database queries
      // For demo purposes, we'll return mock data
      return {
        totalUsers: 1250,
        activeUsers: 780,
        averageSearchesPerUser: 8.5,
        newUsersToday: 25,
        userRetentionRate: 0.78,
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        averageSearchesPerUser: 0,
        newUsersToday: 0,
        userRetentionRate: 0,
      };
    }
  }
  
  // Get marketplace distribution
  async getMarketplaceDistribution(userId: string): Promise<{marketplace: string, count: number}[]> {
    try {
      // In a real implementation, this would query the database
      // For demo purposes, we'll return mock data
      return [
        { marketplace: 'Depop', count: 45 },
        { marketplace: 'eBay', count: 72 },
        { marketplace: 'Vinted', count: 38 },
        { marketplace: 'Facebook', count: 27 },
        { marketplace: 'Craigslist', count: 18 },
      ];
    } catch (error) {
      console.error('Error getting marketplace distribution:', error);
      return [];
    }
  }
  
  // Track item view (for personalization)
  async trackItemView(userId: string, itemId: string, source: string): Promise<void> {
    try {
      const viewEntry = {
        user_id: userId,
        item_id: itemId,
        source,
        timestamp: new Date().toISOString(),
      };
      
      await this.supabase
        .from('item_views')
        .insert([viewEntry]);
    } catch (error) {
      console.error('Error tracking item view:', error);
    }
  }
}
