import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { SearchAggregator } from '@/lib/api/search-aggregator';
import { createClaudeAIService } from '@/lib/ai/claude-service';
import { NotificationService } from '@/lib/api/notification-service';

const ExecuteSearchSchema = z.object({
  searchId: z.string().uuid(),
  immediate: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { searchId, immediate } = ExecuteSearchSchema.parse(body);

    // Get search details
    const { data: search, error: searchError } = await supabase
      .from('searches')
      .select('*')
      .eq('id', searchId)
      .eq('user_id', user.id)
      .single();

    if (searchError || !search) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 });
    }

    // Initialize services
    const searchAggregator = new SearchAggregator();
    const aiService = createClaudeAIService();
    const notificationService = new NotificationService();

    try {
      // Execute search across all marketplaces
      const rawResults = await searchAggregator.searchAllMarketplaces({
        keywords: search.keywords.join(' '),
        minPrice: search.filters?.minPrice,
        maxPrice: search.filters?.maxPrice,
        marketplaces: search.marketplaces,
        location: search.filters?.location,
        itemCondition: search.filters?.condition ? [search.filters.condition] : undefined,
        sortBy: 'newest'
      });

      // AI analysis of results
      const analyzedResults = [];
      const batchSize = 10;
      
      for (let i = 0; i < rawResults.length; i += batchSize) {
        const batch = rawResults.slice(i, i + batchSize);
        
        const batchAnalyses = await Promise.all(
          batch.map(async (result) => {
            try {
              const analysis = await aiService.analyzeListing(
                {
                  title: result.title,
                  price: result.price,
                  currency: 'USD',
                  condition: result.condition,
                  location: result.location,
                  marketplace: result.source,
                  seller: result.seller
                },
                {
                  keywords: search.keywords,
                  filters: search.filters || {},
                  minRelevanceScore: search.minRelevanceScore || 6
                }
              );

              return { ...result, aiAnalysis: analysis };
            } catch (error) {
              console.error('AI analysis failed for result:', result.id, error);
              return {
                ...result,
                aiAnalysis: {
                  relevanceScore: 5,
                  reasoning: 'AI analysis unavailable',
                  confidence: 0.3,
                  keyMatches: [],
                  redFlags: [],
                  priceAnalysis: {
                    fairPrice: true,
                    priceRating: 'fair' as const,
                    marketComparison: 'Unable to analyze'
                  }
                }
              };
            }
          })
        );

        analyzedResults.push(...batchAnalyses);
        
        if (i + batchSize < rawResults.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Filter and save results
      const filteredResults = analyzedResults.filter(
        result => result.aiAnalysis.relevanceScore >= (search.minRelevanceScore || 6)
      );

      filteredResults.sort((a, b) => b.aiAnalysis.relevanceScore - a.aiAnalysis.relevanceScore);

      // Save to database
      if (filteredResults.length > 0) {
        const resultsToSave = filteredResults.map(result => ({
          search_id: searchId,
          user_id: user.id,
          external_id: result.id,
          title: result.title,
          price: result.price,
          image_url: result.image,
          listing_url: result.url,
          marketplace: result.source,
          posted_at: result.postedAt.toISOString(),
          condition: result.condition,
          location: result.location,
          seller_name: result.seller?.name,
          seller_rating: result.seller?.rating,
          relevance_score: result.aiAnalysis.relevanceScore,
          ai_reasoning: result.aiAnalysis.reasoning,
          key_matches: result.aiAnalysis.keyMatches,
          red_flags: result.aiAnalysis.redFlags,
          price_analysis: result.aiAnalysis.priceAnalysis,
        }));

        await supabase
          .from('search_results')
          .upsert(resultsToSave, { 
            onConflict: 'search_id,external_id',
            ignoreDuplicates: false 
          });

        await supabase
          .from('searches')
          .update({ last_run: new Date().toISOString() })
          .eq('id', searchId);

        // Send notifications for high-relevance items
        const highRelevanceResults = filteredResults.filter(
          result => result.aiAnalysis.relevanceScore >= 8
        );

        if (immediate && search.notification_enabled && highRelevanceResults.length > 0) {
          for (const result of highRelevanceResults.slice(0, 5)) {
            try {
              await notificationService.createNotification(user.id, {
                type: 'new_item',
                message: `New high-relevance item found: ${result.title}`,
                data: {
                  item_id: result.id,
                  search_id: searchId,
                  title: result.title,
                  price: result.price,
                  url: result.url,
                  marketplace: result.source,
                  relevance_score: result.aiAnalysis.relevanceScore
                }
              });
            } catch (notifError) {
              console.error('Failed to send notification:', notifError);
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        results: filteredResults.length,
        highRelevance: filteredResults.filter(r => r.aiAnalysis.relevanceScore >= 8).length,
        data: immediate ? filteredResults.slice(0, 20) : undefined
      });

    } catch (executionError) {
      console.error('Search execution error:', executionError);
      return NextResponse.json(
        { error: 'Search execution failed', details: executionError.message },
        { status: 500 }
      );
    }

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
