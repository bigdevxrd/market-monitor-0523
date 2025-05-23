import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('time_range') || 'month';

    // Get analytics in parallel
    const [searchHistory, activeSearches, totalNotifications, unreadNotifications] = await Promise.all([
      supabase.from('search_history').select('*').eq('user_id', user.id).order('timestamp', { ascending: false }).limit(100),
      supabase.from('searches').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_active', true),
      supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false),
    ]);

    // Calculate time range
    const now = new Date();
    const timeRangeDate = new Date();
    switch (timeRange) {
      case 'week':
        timeRangeDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        timeRangeDate.setDate(now.getDate() - 30);
        break;
      case 'year':
        timeRangeDate.setDate(now.getDate() - 365);
        break;
    }

    const recentSearchHistory = searchHistory.data?.filter(
      search => new Date(search.timestamp) > timeRangeDate
    ) || [];

    // Calculate keyword frequencies
    const keywordMap = new Map();
    recentSearchHistory.forEach(search => {
      const keywords = search.query?.keywords || [];
      keywords.forEach((keyword: string) => {
        keywordMap.set(keyword, (keywordMap.get(keyword) || 0) + 1);
      });
    });

    const topKeywords = Array.from(keywordMap.entries())
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));

    return NextResponse.json({
      overview: {
        totalSearches: searchHistory.data?.length || 0,
        activeSearches: activeSearches.count || 0,
        totalNotifications: totalNotifications.count || 0,
        unreadNotifications: unreadNotifications.count || 0,
        recentSearches: recentSearchHistory.length,
      },
      searchAnalytics: {
        totalSearches: recentSearchHistory.length,
        topKeywords,
        recentSearches: recentSearchHistory.slice(0, 10).map(search => ({
          query: search.query,
          timestamp: search.timestamp,
        })),
      },
      timeRange,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
