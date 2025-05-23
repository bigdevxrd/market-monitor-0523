/**
 * Claude AI Integration Service
 * Handles marketplace listing analysis and relevance scoring
 */

interface Listing {
  title: string;
  description?: string;
  price: number;
  currency: string;
  condition?: string;
  location?: string;
  marketplace: string;
  seller?: {
    name: string;
    rating?: number;
    verified?: boolean;
  };
}

interface SearchCriteria {
  keywords: string[];
  filters: {
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    condition?: string;
    radius?: number;
  };
  minRelevanceScore: number;
}

interface AIAnalysisResult {
  relevanceScore: number; // 1-10
  reasoning: string;
  confidence: number; // 0-1
  keyMatches: string[];
  redFlags: string[];
  priceAnalysis: {
    fairPrice: boolean;
    priceRating: 'excellent' | 'good' | 'fair' | 'overpriced';
    marketComparison?: string;
  };
}

export class ClaudeAIService {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1/messages';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Analyze a marketplace listing for relevance to search criteria
   */
  async analyzeListing(
    listing: Listing,
    searchCriteria: SearchCriteria
  ): Promise<AIAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(listing, searchCriteria);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseAIResponse(data.content[0].text);
    } catch (error) {
      console.error('AI analysis error:', error);
      return this.getFallbackAnalysis(listing, searchCriteria);
    }
  }

  /**
   * Batch analyze multiple listings
   */
  async analyzeListings(
    listings: Listing[],
    searchCriteria: SearchCriteria
  ): Promise<AIAnalysisResult[]> {
    const batchSize = 5; // Process in batches to avoid rate limits
    const results: AIAnalysisResult[] = [];

    for (let i = 0; i < listings.length; i += batchSize) {
      const batch = listings.slice(i, i + batchSize);
      const batchPromises = batch.map(listing => 
        this.analyzeListing(listing, searchCriteria)
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < listings.length) {
        await this.delay(1000);
      }
    }

    return results;
  }

  /**
   * Build the analysis prompt for Claude
   */
  private buildAnalysisPrompt(listing: Listing, criteria: SearchCriteria): string {
    return `You are an expert marketplace analyst. Analyze this listing for relevance to the user's search criteria.

LISTING DETAILS:
Title: ${listing.title}
Description: ${listing.description || 'No description provided'}
Price: ${listing.currency}${listing.price}
Condition: ${listing.condition || 'Not specified'}
Location: ${listing.location || 'Not specified'}
Marketplace: ${listing.marketplace}
Seller: ${listing.seller?.name || 'Unknown'} (Rating: ${listing.seller?.rating || 'N/A'})

USER SEARCH CRITERIA:
Keywords: ${criteria.keywords.join(', ')}
Price Range: ${criteria.filters.minPrice || 0} - ${criteria.filters.maxPrice || 'unlimited'}
Preferred Location: ${criteria.filters.location || 'Any'}
Preferred Condition: ${criteria.filters.condition || 'Any'}
Minimum Relevance Required: ${criteria.minRelevanceScore}/10

ANALYSIS REQUIREMENTS:
1. Relevance Score (1-10): How well does this listing match the search criteria?
2. Reasoning: Explain your scoring in 2-3 sentences
3. Key Matches: List specific elements that match the criteria
4. Red Flags: Identify any concerning aspects (spam, scam indicators, overpricing)
5. Price Analysis: Is this fairly priced compared to similar items?

Respond in this exact JSON format:
{
  "relevanceScore": 8,
  "reasoning": "Strong match for vintage Nike sneakers with authentic details and fair pricing.",
  "confidence": 0.85,
  "keyMatches": ["Nike brand match", "Vintage style", "Good condition", "Fair price"],
  "redFlags": ["Minor scuff in photos", "Seller has low rating"],
  "priceAnalysis": {
    "fairPrice": true,
    "priceRating": "good",
    "marketComparison": "Priced 15% below similar listings"
  }
}`;
  }

  /**
   * Parse Claude's response into structured data
   */
  private parseAIResponse(response: string): AIAnalysisResult {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      return {
        relevanceScore: Math.max(1, Math.min(10, parsed.relevanceScore || 5)),
        reasoning: parsed.reasoning || 'Analysis completed',
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
        keyMatches: Array.isArray(parsed.keyMatches) ? parsed.keyMatches : [],
        redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
        priceAnalysis: {
          fairPrice: parsed.priceAnalysis?.fairPrice !== false,
          priceRating: parsed.priceAnalysis?.priceRating || 'fair',
          marketComparison: parsed.priceAnalysis?.marketComparison,
        },
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid AI response format');
    }
  }

  /**
   * Fallback analysis when AI service fails
   */
  private getFallbackAnalysis(
    listing: Listing,
    criteria: SearchCriteria
  ): AIAnalysisResult {
    const keywordMatches = this.countKeywordMatches(listing, criteria.keywords);
    const priceInRange = this.isPriceInRange(listing.price, criteria.filters);
    
    // Simple relevance scoring based on keyword matches and price
    let score = Math.min(keywordMatches * 2, 6);
    if (priceInRange) score += 2;
    score = Math.max(1, Math.min(10, score));

    return {
      relevanceScore: score,
      reasoning: `Fallback analysis: ${keywordMatches} keyword matches, price ${priceInRange ? 'in' : 'out of'} range`,
      confidence: 0.3,
      keyMatches: this.findKeywordMatches(listing, criteria.keywords),
      redFlags: [],
      priceAnalysis: {
        fairPrice: true,
        priceRating: 'fair',
        marketComparison: 'Unable to analyze pricing',
      },
    };
  }

  /**
   * Count keyword matches in listing
   */
  private countKeywordMatches(listing: Listing, keywords: string[]): number {
    const text = `${listing.title} ${listing.description || ''}`.toLowerCase();
    return keywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    ).length;
  }

  /**
   * Find specific keyword matches
   */
  private findKeywordMatches(listing: Listing, keywords: string[]): string[] {
    const text = `${listing.title} ${listing.description || ''}`.toLowerCase();
    return keywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );
  }

  /**
   * Check if price is within specified range
   */
  private isPriceInRange(
    price: number,
    filters: SearchCriteria['filters']
  ): boolean {
    if (filters.minPrice && price < filters.minPrice) return false;
    if (filters.maxPrice && price > filters.maxPrice) return false;
    return true;
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Initialize Claude AI service with environment variable
 */
export function createClaudeAIService(): ClaudeAIService {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY environment variable is required');
  }
  return new ClaudeAIService(apiKey);
}
