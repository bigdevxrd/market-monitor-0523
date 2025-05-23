import axios from 'axios';
import { SearchQuery, SearchResult } from '@/types';

// Base abstract class for all marketplace services
export abstract class MarketplaceService {
  abstract name: string;
  abstract search(query: SearchQuery): Promise<SearchResult[]>;
  abstract getItemDetails(id: string): Promise<any>;
}

// Implementation for Depop
export class DepopService extends MarketplaceService {
  name = 'Depop';
  
  async search(query: SearchQuery): Promise<SearchResult[]> {
    try {
      // Use API key from environment variables
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DEPOP_API_URL}/search`, {
        params: {
          query: query.keywords,
          minPrice: query.minPrice,
          maxPrice: query.maxPrice,
          // Other Depop-specific parameters
        },
        headers: {
          'Authorization': `Bearer ${process.env.DEPOP_API_KEY}`
        }
      });
      
      return response.data.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.mainImage,
        url: `https://depop.com/products/${item.id}`,
        source: this.name,
        postedAt: new Date(item.listedAt),
      }));
    } catch (error) {
      console.error('Error searching Depop:', error);
      return [];
    }
  }
  
  async getItemDetails(id: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_DEPOP_API_URL}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.DEPOP_API_KEY}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting Depop item details:', error);
      throw error;
    }
  }
}

// Implementation for eBay
export class EbayService extends MarketplaceService {
  name = 'eBay';
  
  async search(query: SearchQuery): Promise<SearchResult[]> {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_EBAY_API_URL}/finding`, {
        params: {
          'OPERATION-NAME': 'findItemsByKeywords',
          'SERVICE-VERSION': '1.0.0',
          'SECURITY-APPNAME': process.env.EBAY_APP_ID,
          'RESPONSE-DATA-FORMAT': 'JSON',
          'REST-PAYLOAD': true,
          keywords: query.keywords,
          'itemFilter(0).name': 'MinPrice',
          'itemFilter(0).value': query.minPrice,
          'itemFilter(0).paramName': 'Currency',
          'itemFilter(0).paramValue': 'USD',
          'itemFilter(1).name': 'MaxPrice',
          'itemFilter(1).value': query.maxPrice,
          'itemFilter(1).paramName': 'Currency',
          'itemFilter(1).paramValue': 'USD',
        }
      });
      
      const items = response.data.findItemsByKeywordsResponse[0].searchResult[0].item || [];
      
      return items.map((item: any) => ({
        id: item.itemId[0],
        title: item.title[0],
        price: parseFloat(item.sellingStatus[0].currentPrice[0].__value__),
        image: item.galleryURL[0],
        url: item.viewItemURL[0],
        source: this.name,
        postedAt: new Date(item.listingInfo[0].startTime[0]),
        condition: item.condition?.[0].conditionDisplayName?.[0] || 'Unknown',
      }));
    } catch (error) {
      console.error('Error searching eBay:', error);
      return [];
    }
  }
  
  async getItemDetails(id: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_EBAY_API_URL}/shopping`, {
        params: {
          'callname': 'GetSingleItem',
          'responseencoding': 'JSON',
          'appid': process.env.EBAY_APP_ID,
          'siteid': '0',
          'version': '967',
          'ItemID': id,
          'IncludeSelector': 'Description,ItemSpecifics'
        }
      });
      
      return response.data.Item;
    } catch (error) {
      console.error('Error getting eBay item details:', error);
      throw error;
    }
  }
}

// Implementation for Vinted
export class VintedService extends MarketplaceService {
  name = 'Vinted';
  
  async search(query: SearchQuery): Promise<SearchResult[]> {
    try {
      // Vinted API implementation
      const response = await axios.get(`${process.env.NEXT_PUBLIC_VINTED_API_URL}/items`, {
        params: {
          search_text: query.keywords,
          price_from: query.minPrice,
          price_to: query.maxPrice,
        },
        headers: {
          'X-API-Key': process.env.VINTED_API_KEY
        }
      });
      
      return response.data.items.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        price: item.price,
        image: item.photos[0]?.url,
        url: item.url,
        source: this.name,
        postedAt: new Date(item.created_at),
        condition: item.status,
        location: item.user?.country_title || 'Unknown',
      }));
    } catch (error) {
      console.error('Error searching Vinted:', error);
      return [];
    }
  }
  
  async getItemDetails(id: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_VINTED_API_URL}/items/${id}`, {
        headers: {
          'X-API-Key': process.env.VINTED_API_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting Vinted item details:', error);
      throw error;
    }
  }
}

// Implementation for Facebook Marketplace
export class FacebookService extends MarketplaceService {
  name = 'Facebook Marketplace';
  
  async search(query: SearchQuery): Promise<SearchResult[]> {
    try {
      // Facebook API implementation
      // Note: Facebook Graph API requires user authentication and permission approvals
      const response = await axios.get(`${process.env.NEXT_PUBLIC_FACEBOOK_API_URL}/marketplace_search`, {
        params: {
          q: query.keywords,
          fields: 'id,name,description,price,photos,location,creation_time',
          access_token: process.env.FACEBOOK_API_TOKEN
        }
      });
      
      return response.data.data.map((item: any) => ({
        id: item.id,
        title: item.name,
        price: parseFloat(item.price.amount),
        image: item.photos[0]?.image?.uri,
        url: `https://www.facebook.com/marketplace/item/${item.id}`,
        source: this.name,
        postedAt: new Date(item.creation_time),
        location: item.location?.city ? `${item.location.city}, ${item.location.state}` : 'Unknown',
      }));
    } catch (error) {
      console.error('Error searching Facebook Marketplace:', error);
      return [];
    }
  }
  
  async getItemDetails(id: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_FACEBOOK_API_URL}/${id}`, {
        params: {
          fields: 'id,name,description,price,photos,location,creation_time,seller',
          access_token: process.env.FACEBOOK_API_TOKEN
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting Facebook item details:', error);
      throw error;
    }
  }
}

// Implementation for Craigslist
export class CraigslistService extends MarketplaceService {
  name = 'Craigslist';
  
  async search(query: SearchQuery): Promise<SearchResult[]> {
    try {
      // Craigslist doesn't have an official API, so we'd need to use a scraper service or a third-party API
      const response = await axios.get(`${process.env.NEXT_PUBLIC_CRAIGSLIST_SCRAPER_URL}/search`, {
        params: {
          query: query.keywords,
          minPrice: query.minPrice,
          maxPrice: query.maxPrice,
          location: query.location || 'sfbay',
          distance: query.distance || 50
        },
        headers: {
          'X-API-Key': process.env.CRAIGSLIST_SCRAPER_KEY
        }
      });
      
      return response.data.results.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price ? parseFloat(item.price.replace(/[$,]/g, '')) : 0,
        image: item.imageUrl,
        url: item.url,
        source: this.name,
        postedAt: item.date ? new Date(item.date) : new Date(),
        location: item.location,
      }));
    } catch (error) {
      console.error('Error searching Craigslist:', error);
      return [];
    }
  }
  
  async getItemDetails(id: string): Promise<any> {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_CRAIGSLIST_SCRAPER_URL}/item/${id}`, {
        headers: {
          'X-API-Key': process.env.CRAIGSLIST_SCRAPER_KEY
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting Craigslist item details:', error);
      throw error;
    }
  }
}
