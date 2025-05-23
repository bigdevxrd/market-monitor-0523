-- Search results table (junction table with AI scoring)
CREATE TABLE public.search_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  search_id UUID REFERENCES public.searches(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  relevance_score INTEGER CHECK (relevance_score >= 1 AND relevance_score <= 10),
  ai_reasoning TEXT,
  is_new BOOLEAN DEFAULT true,
  is_notified BOOLEAN DEFAULT false,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_notes TEXT,
  UNIQUE(search_id, listing_id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  search_id UUID REFERENCES public.searches(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('new_match', 'price_drop', 'system', 'digest')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'push', 'sms')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'opened', 'clicked')),
  failure_reason TEXT
);

-- Analytics events table
CREATE TABLE public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  page_url TEXT,
  user_agent TEXT,
  ip_address INET
);

-- Scraping jobs table
CREATE TABLE public.scraping_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  marketplace TEXT NOT NULL CHECK (marketplace IN ('depop', 'facebook', 'ebay', 'vinted', 'craigslist')),
  search_query TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  listings_found INTEGER DEFAULT 0,
  listings_processed INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);
