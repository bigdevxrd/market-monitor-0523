/**
 * Search Scheduler Service
 * Handles automated execution of saved searches
 */

import { createClaudeAIService } from '../ai/claude-service';
import { marketplaceIntegration } from '../integrations/marketplace-integration';
import { NotificationService } from '../api/notification-service';
import { createClient } from '@supabase/supabase-js';

export class SearchSchedulerService {
  private supabase;
  private aiService;
  private notificationService;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.aiService = createClaudeAIService();
    this.notificationService = new NotificationService();
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
