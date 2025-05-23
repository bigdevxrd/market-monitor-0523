-- Market Monitor Database Schema
-- This file contains the complete database schema for the marketplace monitoring application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  credits_remaining INTEGER DEFAULT 3,
  max_searches INTEGER DEFAULT 3,
  notification_preferences JSONB DEFAULT '{"email": true, "push": false, "sms": false}'::jsonb,
  timezone TEXT DEFAULT 'UTC',
  api_key TEXT UNIQUE,
  PRIMARY KEY (id)
);

-- Saved searches table
CREATE TABLE public.searches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  marketplaces TEXT[] DEFAULT '{"depop", "facebook", "ebay", "vinted", "craigslist"}',
  filters JSONB DEFAULT '{}'::jsonb, -- Price range, location, condition, etc.
  ai_matching_enabled BOOLEAN DEFAULT true,
  min_relevance_score INTEGER DEFAULT 6 CHECK (min_relevance_score >= 1 AND min_relevance_score <= 10),
  notification_settings JSONB DEFAULT '{"instant": true, "digest": false, "frequency": "immediate"}'::jsonb,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  total_results INTEGER DEFAULT 0,
  new_results INTEGER DEFAULT 0
);

-- Marketplace listings table
CREATE TABLE public.listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  external_id TEXT NOT NULL, -- ID from the marketplace
  marketplace TEXT NOT NULL CHECK (marketplace IN ('depop', 'facebook', 'ebay', 'vinted', 'craigslist')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  posted_at TIMESTAMP WITH TIME ZONE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  condition TEXT,
  location TEXT,
  seller_name TEXT,
  seller_rating DECIMAL(3, 2),
  seller_verified BOOLEAN DEFAULT false,
  images TEXT[], -- Array of image URLs
  url TEXT NOT NULL,
  raw_data JSONB, -- Store original API response
  is_active BOOLEAN DEFAULT true,
  sold_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(external_id, marketplace)
);

-- Search results table (junction table with AI scoring)
CREATE TABLE public.search_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  search_id UUID REFERENCES public.searches(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  relevance_score INTEGER CHECK (relevance_score >= 1 AND relevance_score <= 10),
  ai_reasoning TEXT, -- Claude's explanation for the score
  is_new BOOLEAN DEFAULT true,
  is_notified BOOLEAN DEFAULT false,
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5), -- User feedback on match quality
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

-- API usage tracking table
CREATE TABLE public.api_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  request_data JSONB,
  response_data JSONB,
  api_key_used TEXT
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

-- Indexes for performance
CREATE INDEX idx_profiles_subscription_tier ON public.profiles(subscription_tier);
CREATE INDEX idx_searches_user_id ON public.searches(user_id);
CREATE INDEX idx_searches_is_active ON public.searches(is_active);
CREATE INDEX idx_searches_last_checked ON public.searches(last_checked_at);

CREATE INDEX idx_listings_marketplace ON public.listings(marketplace);
CREATE INDEX idx_listings_posted_at ON public.listings(posted_at);
CREATE INDEX idx_listings_price ON public.listings(price);
CREATE INDEX idx_listings_is_active ON public.listings(is_active);
CREATE INDEX idx_listings_external_id_marketplace ON public.listings(external_id, marketplace);

CREATE INDEX idx_search_results_search_id ON public.search_results(search_id);
CREATE INDEX idx_search_results_listing_id ON public.search_results(listing_id);
CREATE INDEX idx_search_results_relevance_score ON public.search_results(relevance_score);
CREATE INDEX idx_search_results_is_new ON public.search_results(is_new);
CREATE INDEX idx_search_results_created_at ON public.search_results(created_at);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX idx_notifications_status ON public.notifications(status);
CREATE INDEX idx_notifications_type ON public.notifications(type);

CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_event_name ON public.analytics_events(event_name);

CREATE INDEX idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON public.api_usage(created_at);

CREATE INDEX idx_scraping_jobs_marketplace ON public.scraping_jobs(marketplace);
CREATE INDEX idx_scraping_jobs_status ON public.scraping_jobs(status);
CREATE INDEX idx_scraping_jobs_created_at ON public.scraping_jobs(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Searches policies
CREATE POLICY "Users can view own searches" ON public.searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own searches" ON public.searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own searches" ON public.searches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own searches" ON public.searches
  FOR DELETE USING (auth.uid() = user_id);

-- Search results policies
CREATE POLICY "Users can view own search results" ON public.search_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.searches 
      WHERE searches.id = search_results.search_id 
      AND searches.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert search results" ON public.search_results
  FOR INSERT WITH CHECK (true); -- Allow system to insert

CREATE POLICY "Users can update own search results" ON public.search_results
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.searches 
      WHERE searches.id = search_results.search_id 
      AND searches.user_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true); -- Allow system to insert

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Analytics events policies
CREATE POLICY "Users can view own analytics" ON public.analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics" ON public.analytics_events
  FOR INSERT WITH CHECK (true); -- Allow system to insert

-- API usage policies
CREATE POLICY "Users can view own API usage" ON public.api_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert API usage" ON public.api_usage
  FOR INSERT WITH CHECK (true); -- Allow system to insert

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER searches_updated_at
  BEFORE UPDATE ON public.searches
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER scraping_jobs_updated_at
  BEFORE UPDATE ON public.scraping_jobs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate API keys
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'mm_' || encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to update search statistics
CREATE OR REPLACE FUNCTION public.update_search_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.searches 
    SET 
      total_results = total_results + 1,
      new_results = CASE WHEN NEW.is_new THEN new_results + 1 ELSE new_results END
    WHERE id = NEW.search_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle when is_new changes from true to false
    IF OLD.is_new = true AND NEW.is_new = false THEN
      UPDATE public.searches 
      SET new_results = new_results - 1
      WHERE id = NEW.search_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for search statistics
CREATE TRIGGER search_results_stats
  AFTER INSERT OR UPDATE OF is_new ON public.search_results
  FOR EACH ROW EXECUTE FUNCTION public.update_search_stats();
