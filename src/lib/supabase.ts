import { createClient } from '@supabase/supabase-js';

// Check if we have real environment variables or should use demo mode
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Use demo mode if URLs are empty or contain placeholder text
const isDemoMode = 
  !supabaseUrl || 
  !supabaseAnonKey || 
  supabaseUrl.includes('your-project') || 
  supabaseUrl.includes('demo') ||
  supabaseAnonKey.includes('your_supabase') ||
  supabaseAnonKey.includes('demo');

// Create appropriate client
export const supabase = isDemoMode 
  ? createMockSupabaseClient() 
  : createClient(supabaseUrl, supabaseAnonKey);

// Mock Supabase client for demo/development
function createMockSupabaseClient() {
  const mockUser = {
    id: 'demo-user-123',
    email: 'demo@dealhawk.ai',
    created_at: new Date().toISOString()
  };

  const mockSession = {
    user: mockUser,
    access_token: 'demo-token',
    refresh_token: 'demo-refresh'
  };

  return {
    auth: {
      getUser: () => Promise.resolve({ 
        data: { user: mockUser }, 
        error: null 
      }),
      getSession: () => Promise.resolve({ 
        data: { session: mockSession },
        error: null
      }),
      signInWithPassword: () => Promise.resolve({ 
        data: { user: mockUser, session: mockSession }, 
        error: null 
      }),
      signUp: () => Promise.resolve({ 
        data: { user: mockUser, session: mockSession }, 
        error: null 
      }),
      signOut: () => Promise.resolve({ error: null }),
      signInWithOAuth: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ 
        data: { user: mockUser }, 
        error: null 
      }),
      onAuthStateChange: (callback) => {
        // Simulate initial auth state
        setTimeout(() => callback('SIGNED_IN', mockSession), 100);
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => console.log('Unsubscribed from auth state') 
            } 
          } 
        };
      }
    },
    from: (table: string) => ({
      select: (columns = '*') => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: any) => ({
            limit: (count: number) => Promise.resolve({ 
              data: getMockData(table).slice(0, count), 
              error: null 
            }),
            range: (from: number, to: number) => Promise.resolve({ 
              data: getMockData(table).slice(from, to + 1), 
              error: null 
            })
          }),
          single: () => Promise.resolve({ 
            data: getMockData(table)[0] || null, 
            error: null 
          })
        }),
        order: (column: string, options?: any) => Promise.resolve({ 
          data: getMockData(table), 
          error: null 
        }),
        limit: (count: number) => Promise.resolve({ 
          data: getMockData(table).slice(0, count), 
          error: null 
        }),
        single: () => Promise.resolve({ 
          data: getMockData(table)[0] || null, 
          error: null 
        })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: { id: 'new-' + Date.now(), ...data }, 
            error: null 
          })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ 
          data: { id: value, ...data }, 
          error: null 
        })
      }),
      upsert: (data: any, options?: any) => Promise.resolve({ 
        data: Array.isArray(data) ? data : [data], 
        error: null 
      })
    })
  };
}

// Mock data for different tables
function getMockData(table: string) {
  const mockData: Record<string, any[]> = {
    searches: [
      {
        id: '1',
        user_id: 'demo-user-123',
        name: 'Vintage Nike Sneakers',
        keywords: ['nike', 'vintage', 'sneakers'],
        marketplaces: ['depop', 'ebay'],
        filters: { minPrice: 50, maxPrice: 200 },
        created_at: '2024-01-15T10:00:00Z',
        last_run: '2024-01-20T15:30:00Z',
        notification_enabled: true,
        is_active: true,
        minRelevanceScore: 7
      },
      {
        id: '2',
        user_id: 'demo-user-123', 
        name: 'Leather Jackets',
        keywords: ['leather', 'jacket', 'vintage'],
        marketplaces: ['depop', 'facebook'],
        filters: { minPrice: 80, maxPrice: 300 },
        created_at: '2024-01-10T09:00:00Z',
        last_run: '2024-01-19T12:00:00Z',
        notification_enabled: false,
        is_active: false,
        minRelevanceScore: 6
      }
    ],
    notifications: [
      {
        id: '1',
        user_id: 'demo-user-123',
        type: 'new_item',
        message: 'New high-relevance item found: Vintage Nike Air Max 90',
        read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        data: { 
          price: 75, 
          marketplace: 'depop',
          relevance_score: 9.2,
          title: 'Vintage Nike Air Max 90',
          url: 'https://depop.com/example'
        }
      },
      {
        id: '2',
        user_id: 'demo-user-123',
        type: 'price_drop', 
        message: 'Price dropped on Leather Jacket from $150 to $120',
        read: true,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        data: { 
          price: 120, 
          old_price: 150,
          marketplace: 'facebook'
        }
      }
    ],
    search_results: [
      {
        id: '1',
        search_id: '1',
        user_id: 'demo-user-123',
        external_id: 'depop_12345',
        title: 'Vintage Nike Air Max 90 - Excellent Condition',
        price: 75,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        listing_url: 'https://depop.com/example/12345',
        marketplace: 'depop',
        posted_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
        condition: 'excellent',
        location: 'New York, NY',
        seller_name: 'vintagesneakers_ny',
        seller_rating: 4.8,
        relevance_score: 9.2,
        ai_reasoning: 'Perfect keyword match for vintage Nike sneakers, excellent condition, fair pricing below market average',
        key_matches: ['nike', 'vintage', 'air max 90', 'excellent condition'],
        red_flags: [],
        price_analysis: {
          fairPrice: true,
          priceRating: 'good',
          marketComparison: 'Priced 15% below similar listings'
        }
      },
      {
        id: '2',
        search_id: '2',
        user_id: 'demo-user-123',
        external_id: 'facebook_67890',
        title: 'Vintage Leather Motorcycle Jacket',
        price: 120,
        image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
        listing_url: 'https://facebook.com/marketplace/example',
        marketplace: 'facebook',
        posted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        condition: 'good',
        location: 'Los Angeles, CA',
        seller_name: 'leather_collector',
        seller_rating: 4.5,
        relevance_score: 8.7,
        ai_reasoning: 'Strong match for vintage leather jacket keywords, good condition, reasonable pricing',
        key_matches: ['leather', 'jacket', 'vintage', 'motorcycle'],
        red_flags: ['minor scuffs mentioned'],
        price_analysis: {
          fairPrice: true,
          priceRating: 'fair',
          marketComparison: 'Market average pricing'
        }
      }
    ],
    profiles: [
      {
        id: 'demo-user-123',
        email: 'demo@dealhawk.ai',
        firstName: 'Demo',
        lastName: 'User',
        subscription_tier: 'pro',
        max_searches: 25,
        notificationPreferences: {
          email_enabled: true,
          push_enabled: true,
          sms_enabled: false,
          email_frequency: 'instant'
        },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: new Date().toISOString()
      }
    ]
  };
  
  return mockData[table] || [];
}
