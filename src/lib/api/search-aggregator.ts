import { MarketplaceService, DepopService, EbayService, VintedService, FacebookService, CraigslistService } from './marketplace-service';
import { SearchQuery, SearchResult } from '@/types';

export class SearchAggregator {
  private services: MarketplaceService[];
  
  constructor(enabledServices: string[] = ['all']) {
    // Initialize all services or just the enabled ones
    this.services = [];
    
    if (enabledServices.includes('all') || enabledServices.includes('depop')) {
      this.services.push(new DepopService());
    }
    
    if (enabledServices.includes('all') || enabledServices.includes('ebay')) {
      this.services.push(new EbayService());
    }
    
    if (enabledServices.includes('all') || enabledServices.includes('vinted')) {
      this.services.push(new VintedService());
    }
    
    if (enabledServices.includes('all') || enabledServices.includes('facebook')) {
      this.services.push(new FacebookService());
    }
    
    if (enabledServices.includes('all') || enabledServices.includes('craigslist')) {
      this.services.push(new CraigslistService());
    }
  }
  
  async search(query: SearchQuery): Promise<{results: SearchResult[], errors: any[]}> {
    // Run searches in parallel across all services
    const searchPromises = this.services.map(service => 
      service.search(query)
        .catch(error => {
          console.error(`Error with ${service.name} search:`, error);
          return { error, service: service.name };
        })
    );
    
    const results = await Promise.allSettled(searchPromises);
    
    const allResults: SearchResult[] = [];
    const errors: any[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (Array.isArray(result.value)) {
          // Successful search returned array of results
          allResults.push(...result.value);
        } else if (result.value.error) {
          // Search returned an error object
          errors.push(result.value);
        }
      } else {
        // Promise rejected
        errors.push({
          service: this.services[index].name,
          error: result.reason
        });
      }
    });
    
    // Apply sorting based on query parameters
    this.sortResults(allResults, query.sortBy || 'newest');
    
    return { results: allResults, errors };
  }
  
  private sortResults(results: SearchResult[], sortBy: string): void {
    switch (sortBy) {
      case 'newest':
        results.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
        break;
      case 'price_low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'relevance':
        // Relevance sorting would typically be handled by the individual APIs
        // We could implement a basic relevance algorithm here if needed
        break;
      default:
        results.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
    }
  }
  
  async getItemDetails(id: string, source: string): Promise<any> {
    const service = this.services.find(s => s.name.toLowerCase() === source.toLowerCase());
    
    if (!service) {
      throw new Error(`No service found for source: ${source}`);
    }
    
    return service.getItemDetails(id);
  }
}
