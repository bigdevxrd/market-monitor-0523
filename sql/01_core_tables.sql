-- Market Monitor Database Schema - Core Tables
-- This file contains the core database tables for the marketplace monitoring application

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
  filters JSONB DEFAULT '{}'::jsonb,
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
  external_id TEXT NOT NULL,
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
  images TEXT[],
  url TEXT NOT NULL,
  raw_data JSONB,
  is_active BOOLEAN DEFAULT true,
  sold_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(external_id, marketplace)
);
