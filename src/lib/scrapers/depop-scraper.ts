/**
 * Depop Marketplace Scraper
 * Handles search queries and listing extraction from Depop
 */

import { SearchQuery, SearchResult } from '@/types';

interface DepopListing {
  id: string;
  title: string;
  description: string;
  price: {
    currency: string;
    amount: number;
  };
  images: string[];
  seller: {
    id: string;
    username: string;
    verified: boolean;
    rating?: number;
  };
  condition?: string;
  posted_at: string;
  url: string;
  location?: string;
}

interface DepopSearchResponse {
  products: DepopListing[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

export class DepopScraper {
  private baseUrl = 'https://webapi.depop.com/api/v2';
  private rateLimitDelay = 1000; // 1 second between requests
  private lastRequestTime = 0;

  /**
   * Search Depop for listings matching the query
   */
  async search(query: SearchQuery): Promise<SearchResult[]> {
    try {
      await this.respectRateLimit();
      
      const searchParams = this.buildSearchParams(query);
      const response = await this.makeRequest('/search/products', searchParams);
      
      if (!response.ok) {
        throw new Error(`Depop API error: ${response.status}`);
      }

      const data: DepopSearchResponse = await response.json();
      return this.transformListings(data.products);
    } catch (error) {
      console.error('Depop search error:', error);
      return [];
    }
  }

  /**
   * Get multiple pages of results
   */
  async searchMultiplePages(
    query: SearchQuery, 
    maxPages: number = 3
  ): Promise<SearchResult[]> {
    const allResults: SearchResult[] = [];
    
    for (let page = 0; page < maxPages; page++) {
      const pageQuery = {
        ...query,
        sortBy: query.sortBy || 'newest'
      };
      
      const results = await this.searchWithOffset(pageQuery, page * 20);
      if (results.length === 0) break;
      
      allResults.push(...results);
      
      // Add delay between pages
      await this.delay(this.rateLimitDelay);
    }
    
    return allResults;
  }

  /**
   * Search with specific offset for pagination
   */
  private async searchWithOffset(
    query: SearchQuery, 
    offset: number
  ): Promise<SearchResult[]> {
    try {
      await this.respectRateLimit();
      
      const searchParams = this.buildSearchParams(query, offset);
      const response = await this.makeRequest('/search/products', searchParams);
      
      if (!response.ok) {
        throw new Error(`Depop API error: ${response.status}`);
      }

      const data: DepopSearchResponse = await response.json();
      return this.transformListings(data.products);
    } catch (error) {
      console.error('Depop search error:', error);
      return [];
    }
  }

  /**
   * Build search parameters for Depop API
   */
  private buildSearchParams(query: SearchQuery, offset: number = 0): URLSearchParams {
    const params = new URLSearchParams();
    
    // Keywords
    if (query.keywords) {
      params.append('q', query.keywords);
    }
    
    // Pagination
    params.append('limit', '20');
    params.append('offset', offset.toString());
    
    // Sorting
    const sortMap = {
      'newest': 'time',
      'price_low': 'price_asc',
      'price_high': 'price_desc',
      'relevance': 'relevance'
    };
    params.append('sort', sortMap[query.sortBy || 'newest'] || 'time');
    
    // Price filters
    if (query.minPrice) {
      params.append('priceMin', query.minPrice.toString());
    }
    if (query.maxPrice) {
      params.append('priceMax', query.maxPrice.toString());
    }
    
    // Condition filter
    if (query.itemCondition && query.itemCondition.length > 0) {
      query.itemCondition.forEach(condition => {
        params.append('condition', this.mapCondition(condition));
      });
    }
    
    // Location filter
    if (query.location) {
      params.append('countryCode', this.getCountryCode(query.location));
    }
    
    return params;
  }

  /**
   * Map our condition values to Depop's format
   */
  private mapCondition(condition: string): string {
    const conditionMap: Record<string, string> = {
      'new': 'new_with_tags',
      'like_new': 'new_no_tags',
      'good': 'good',
      'fair': 'well_worn',
      'poor': 'well_worn'
    };
    return conditionMap[condition] || condition;
  }

  /**
   * Get country code from location string
   */
  private getCountryCode(location: string): string {
    const locationMap: Record<string, string> = {
      'uk': 'GB',
      'united kingdom': 'GB',
      'us': 'US',
      'usa': 'US',
      'united states': 'US',
      'canada': 'CA',
      'australia': 'AU',
      'france': 'FR',
      'germany': 'DE',
      'italy': 'IT',
      'spain': 'ES'
    };
    
    const normalized = location.toLowerCase();
    return locationMap[normalized] || 'GB'; // Default to UK
  }

  /**
   * Transform Depop listings to our standard format
   */
  private transformListings(listings: DepopListing[]): SearchResult[] {
    return listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      price: listing.price.amount,
      image: listing.images[0] || '',
      url: listing.url,
      source: 'depop',
      postedAt: new Date(listing.posted_at),
      condition: listing.condition,
      location: listing.location,
      seller: {
        id: listing.seller.id,
        name: listing.seller.username,
        rating: listing.seller.rating
      }
    }));
  }

  /**
   * Make HTTP request with proper headers and error handling
   */
  private async makeRequest(
    endpoint: string, 
    params?: URLSearchParams
  ): Promise<Response> {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      url.search = params.toString();
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    // Add proxy support if configured
    const proxyUrl = process.env.PROXY_URL;
    if (proxyUrl) {
      // Note: In production, you'd use a proper proxy service
      headers['X-Proxy-Url'] = proxyUrl;
    }

    return fetch(url.toString(), {
      method: 'GET',
      headers,
    });
  }

  /**
   * Respect rate limiting
   */
  private async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await this.delay(this.rateLimitDelay - timeSinceLastRequest);
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Health check - verify scraper is working
   */
  async healthCheck(): Promise<boolean> {
    try {
      const testQuery: SearchQuery = {
        keywords: 'test',
        marketplaces: ['depop']
      };
      
      const results = await this.search(testQuery);
      return results !== null; // Basic check that we got a response
    } catch (error) {
      console.error('Depop health check failed:', error);
      return false;
    }
  }
}

/**
 * Factory function to create Depop scraper instance
 */
export function createDepopScraper(): DepopScraper {
  return new DepopScraper();
}
