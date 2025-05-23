/**
 * Marketplace Integration Service
 * Orchestrates searches across all supported marketplaces
 */

import { SearchQuery, SearchResult } from '@/types';
import { DepopScraper } from '../scrapers/depop-scraper';
import { FacebookMarketplaceScraper } from '../scrapers/facebook-scraper';

interface MarketplaceScraper {
  search(query: SearchQuery): Promise<SearchResult[]>;
  healthCheck(): Promise<boolean>;
}

export class MarketplaceIntegrationService {
  private scrapers: Map<string, MarketplaceScraper> = new Map();

  constructor() {
    this.initializeScrapers();
  }

  /**
   * Initialize all marketplace scrapers
   */
  private initializeScrapers() {
    this.scrapers.set('depop', new DepopScraper());
    this.scrapers.set('facebook', new FacebookMarketplaceScraper());
  }

  /**
   * Search across all specified marketplaces
   */
  async searchAllMarketplaces(query: SearchQuery): Promise<SearchResult[]> {
    const marketplaces = query.marketplaces || ['depop', 'facebook'];
    const allResults: SearchResult[] = [];

    // Execute searches in parallel for better performance
    const searchPromises = marketplaces.map(async (marketplace) => {
      const scraper = this.scrapers.get(marketplace);
      if (!scraper) {
        console.warn(`Scraper not found for marketplace: ${marketplace}`);
        return [];
      }

      try {
        const results = await scraper.search(query);
        return results.map((result: SearchResult) => ({
          ...result,
          source: marketplace
        }));
      } catch (error) {
        console.error(`Search failed for ${marketplace}:`, error);
        return [];
      }
    });

    const resultsArrays = await Promise.all(searchPromises);
    resultsArrays.forEach(results => allResults.push(...results));

    // Sort by posting date (newest first)
    return allResults.sort((a, b) => 
      new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
    );
  }

  /**
   * Get health status of all scrapers
   */
  async getHealthStatus(): Promise<Record<string, boolean>> {
    const status: Record<string, boolean> = {};
    
    for (const [marketplace, scraper] of this.scrapers.entries()) {
      try {
        status[marketplace] = await scraper.healthCheck();
      } catch (error) {
        console.error(`Health check failed for ${marketplace}:`, error);
        status[marketplace] = false;
      }
    }
    
    return status;
  }
}

export const marketplaceIntegration = new MarketplaceIntegrationService();
