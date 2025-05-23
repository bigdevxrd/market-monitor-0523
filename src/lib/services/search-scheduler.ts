/**
 * Search Scheduler Service
 * Handles automated execution of saved searches
 */

import { createClaudeAIService } from '../ai/claude-service';
import { SearchAggregator } from '../api/search-aggregator';
import { NotificationService } from '../api/notification-service';
import { createClient } from '@supabase/supabase-js';
import { SearchQuery } from '@/types';

export class SearchSchedulerService {
  private supabase;
  private aiService;
  private notificationService;
  private searchAggregator;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.aiService = createClaudeAIService();
    this.notificationService = new NotificationService();
    this.searchAggregator = new SearchAggregator();
  }

  /**
   * Execute all active searches that are due for execution
   */
  async executeScheduledSearches(): Promise<void> {
    try {
      const { data: searches, error } = await this.supabase
        .from('searches')
        .select('*')
        .eq('is_active', true)
        .or(`
          last_run.is.null,
          last_run.lt.${new Date(Date.now() - 30 * 60 * 1000).toISOString()}
        `);

      if (error || !searches?.length) {
        console.log('No scheduled searches to execute');
        return;
      }

      console.log(`Executing ${searches.length} scheduled searches`);

      const batchSize = 5;
      for (let i = 0; i < searches.length; i += batchSize) {
        const batch = searches.slice(i, i + batchSize);
        await Promise.all(batch.map(search => this.executeSearch(search)));
        
        if (i + batchSize < searches.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      console.error('Error in executeScheduledSearches:', error);
    }
  }

  /**
   * Execute a single search and process the results
   * @param search The search configuration to execute
   */
  private async executeSearch(search: any): Promise<void> {
    try {
      console.log(`Executing search: ${search.name || search.id}`);
      
      // Update the last_run timestamp
      const { error: updateError } = await this.supabase
        .from('searches')
        .update({ last_run: new Date().toISOString() })
        .eq('id', search.id);
      
      if (updateError) {
        console.error('Error updating search last_run:', updateError);
        return;
      }

      // Get previous results to compare with new results
      const { data: previousResults } = await this.supabase
        .from('search_results')
        .select('result_data')
        .eq('search_id', search.id)
        .order('created_at', { ascending: false })
        .limit(100);

      // Create a set of previous item IDs for quick lookup
      const previousItemIds = new Set(
        (previousResults || []).map(record => record.result_data.id)
      );

      // Execute the search against the marketplace
      const { results, errors } = await this.searchAggregator.search(search.query as SearchQuery);
      
      if (errors.length > 0) {
        console.warn(`Encountered ${errors.length} errors during search execution:`, errors);
      }
      
      // Filter to only new results that weren't in previous results
      const newResults = results.filter(result => !previousItemIds.has(result.id));
      
      // Store new results
      if (newResults && newResults.length > 0) {
        const { error: resultsError } = await this.supabase
          .from('search_results')
          .insert(
            newResults.map(result => ({
              search_id: search.id,
              result_data: result,
              created_at: new Date().toISOString()
            }))
          );
        
        if (resultsError) {
          console.error('Error storing search results:', resultsError);
        } else {
          // Create notification for the user
          await this.notificationService.createNotification({
            user_id: search.user_id,
            type: 'search_results',
            title: `New results for "${search.name || 'your search'}"`,
            content: `Found ${newResults.length} new results for your saved search "${search.name || 'your search'}"`,
            metadata: { search_id: search.id, result_count: newResults.length }
          });

          // If email notifications are enabled for this search, send an email
          if (search.notification_email) {
            await this.notificationService.sendEmailNotification(
              search.user_id,
              `New items found for "${search.name || 'your search'}"`,
              `We found ${newResults.length} new items matching your search criteria. Check your dashboard to view them.`
            );
          }
        }
      } else {
        console.log(`No new results found for search: ${search.name || search.id}`);
      }
    } catch (error) {
      console.error(`Error executing search ${search.id}:`, error);
    }
  }
}
