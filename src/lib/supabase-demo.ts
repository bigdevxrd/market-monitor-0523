import { createClient } from '@supabase/supabase-js';

// Demo mode configuration
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo_key';

// Create client (will be mocked in demo mode)
export const supabase = isDemoMode 
  ? createMockSupabaseClient() 
  : createClient(supabaseUrl, supabaseAnonKey);

// Mock Supabase client for demo purposes
function createMockSupabaseClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ 
        data: { 
          user: { 
            id: 'demo-user-123', 
            email: 'demo@example.com' 
          } 
        }, 
        error: null 
      }),
      getSession: () => Promise.resolve({ 
        data: { 
          session: { 
            user: { 
              id: 'demo-user-123', 
              email: 'demo@example.com' 
            } 
          } 
        } 
      }),
      signInWithPassword: () => Promise.resolve({ error: null }),
      signUp: () => Promise.resolve({ error: null, data: { user: { id: 'demo-user-123' } } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: getMockData(table), error: null })
          }),
          single: () => Promise.resolve({ data: getMockData(table)[0], error: null })
        }),
        order: () => Promise.resolve({ data: getMockData(table), error: null })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: getMockData(table)[0], error: null })
        })
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: getMockData(table)[0], error: null })
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
        name: 'Vintage Nike Sneakers',
        keywords: ['nike', 'vintage', 'sneakers'],
        marketplaces: ['depop', 'ebay'],
        created_at: '2024-01-15T10:00:00Z',
        last_run: '2024-01-20T15:30:00Z',
        notification_enabled: true
      },
      {
        id: '2', 
        name: 'Leather Jackets',
        keywords: ['leather', 'jacket', 'vintage'],
        marketplaces: ['depop', 'facebook'],
        created_at: '2024-01-10T09:00:00Z',
        last_run: '2024-01-19T12:00:00Z',
        notification_enabled: false
      }
    ],
    notifications: [
      {
        id: '1',
        type: 'new_item',
        message: 'New item found: Vintage Nike Air Max 90',
        read: false,
        created_at: '2024-01-20T16:00:00Z',
        data: { price: 75, marketplace: 'depop' }
      },
      {
        id: '2',
        type: 'price_drop', 
        message: 'Price dropped on Leather Jacket',
        read: true,
        created_at: '2024-01-19T14:00:00Z',
        data: { price: 120, old_price: 150 }
      }
    ],
    search_results: [
      {
        id: '1',
        title: 'Vintage Nike Air Max 90 - Excellent Condition',
        price: 75,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
        marketplace: 'depop',
        relevance_score: 9,
        posted_at: '2024-01-20T15:00:00Z'
      }
    ]
  };
  
  return mockData[table] || [];
}
