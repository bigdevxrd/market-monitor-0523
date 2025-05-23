// User and Authentication Types
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  notificationPreferences?: NotificationPreferences;
  createdAt: string;
  updatedAt: string;
}

// Search Types
export interface SearchQuery {
  keywords: string;
  minPrice?: number;
  maxPrice?: number;
  marketplaces: string[];
  sortBy?: 'newest' | 'price_low' | 'price_high' | 'relevance';
  itemCondition?: string[];
  location?: string;
  distance?: number;
  saveSearch?: boolean;
  searchName?: string;
  notifyWhenFound?: boolean;
  condition?: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  price: number;
  image: string;
  url: string;
  source: string;
  postedAt: Date;
  condition?: string;
  location?: string;
  seller?: {
    id: string;
    name: string;
    rating?: number;
  };
}

export interface SearchTemplate {
  id: string;
  user_id: string;
  name: string;
  query: SearchQuery;
  created_at: string;
  last_run?: string;
  notification_enabled: boolean;
}

// Notification Types
export type NotificationType = 'new_item' | 'price_drop' | 'system' | 'account';

export interface NotificationData {
  item_id?: string;
  search_id?: string;
  price?: number;
  old_price?: number;
  title?: string;
  url?: string;
  marketplace?: string;
  relevance_score?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  data?: NotificationData;
  read: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
  email_frequency: 'instant' | 'daily' | 'weekly';
  notify_new_items: boolean;
  notify_price_drops: boolean;
  notify_system: boolean;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Analytics Types
export interface SearchAnalytics {
  totalSearches: number;
  recentSearches: Array<{
    query: SearchQuery;
    timestamp: string;
  }>;
  topKeywords: Array<{
    keyword: string;
    count: number;
  }>;
}

export interface PriceTrend {
  date: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  itemCount: number;
}

export interface MarketplaceDistribution {
  marketplace: string;
  itemCount: number;
  averagePrice: number;
  percentage: number;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  averageSearchesPerUser: number;
  newUsersToday: number;
  userRetentionRate: number;
}
