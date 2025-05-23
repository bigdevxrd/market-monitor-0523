import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

const CreateSearchSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
  description: z.string().optional(),
  marketplaces: z.array(z.enum(['depop', 'facebook', 'ebay', 'vinted', 'craigslist'])),
  filters: z.object({
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    location: z.string().optional(),
    condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']).optional(),
    radius: z.number().optional(),
  }).optional(),
  minRelevanceScore: z.number().min(1).max(10).default(6),
  notificationSettings: z.object({
    instant: z.boolean().default(true),
    digest: z.boolean().default(false),
    frequency: z.enum(['immediate', 'hourly', 'daily']).default('immediate'),
  }).optional(),
});

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: searches, error } = await supabase
      .from('searches')
      .select(`
        *,
        _count: search_results(count)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching searches:', error);
      return NextResponse.json({ error: 'Failed to fetch searches' }, { status: 500 });
    }

    return NextResponse.json({ searches });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user's search limit based on subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, max_searches')
      .eq('id', user.id)
      .single();

    const { data: existingSearches } = await supabase
      .from('searches')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (existingSearches && existingSearches.length >= (profile?.max_searches || 3)) {
      return NextResponse.json(
        { error: 'Search limit reached. Upgrade your plan for more searches.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = CreateSearchSchema.parse(body);

    const { data: search, error } = await supabase
      .from('searches')
      .insert({
        user_id: user.id,
        ...validatedData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating search:', error);
      return NextResponse.json({ error: 'Failed to create search' }, { status: 500 });
    }

    return NextResponse.json({ search }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
