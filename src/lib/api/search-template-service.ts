import { createClient } from '@supabase/supabase-js';
import { SearchQuery, SearchTemplate } from '@/types';

export class SearchTemplateService {
  private supabase;
  
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  async getSavedSearches(userId: string): Promise<SearchTemplate[]> {
    try {
      const { data, error } = await this.supabase
        .from('search_templates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching saved searches:', error);
      return [];
    }
  }
  
  async saveSearch(userId: string, query: SearchQuery, name: string): Promise<{success: boolean, id?: string, error?: any}> {
    try {
      const template: Partial<SearchTemplate> = {
        user_id: userId,
        name,
        query,
        created_at: new Date().toISOString(),
        notification_enabled: query.notifyWhenFound || false
      };
      
      const { data, error } = await this.supabase
        .from('search_templates')
        .insert([template])
        .select();
        
      if (error) throw error;
      
      return { success: true, id: data?.[0]?.id };
    } catch (error) {
      console.error('Error saving search:', error);
      return { success: false, error };
    }
  }
  
  async updateSearch(templateId: string, updates: Partial<SearchTemplate>): Promise<{success: boolean, error?: any}> {
    try {
      const { error } = await this.supabase
        .from('search_templates')
        .update(updates)
        .eq('id', templateId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error updating search template:', error);
      return { success: false, error };
    }
  }
  
  async deleteSearch(templateId: string): Promise<{success: boolean, error?: any}> {
    try {
      const { error } = await this.supabase
        .from('search_templates')
        .delete()
        .eq('id', templateId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting search template:', error);
      return { success: false, error };
    }
  }
  
  async runSavedSearch(templateId: string): Promise<{success: boolean, results?: any[], error?: any}> {
    try {
      // First get the template
      const { data: template, error: templateError } = await this.supabase
        .from('search_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (templateError) throw templateError;
      
      if (!template) {
        throw new Error('Search template not found');
      }
      
      // Update last run timestamp
      await this.supabase
        .from('search_templates')
        .update({ last_run: new Date().toISOString() })
        .eq('id', templateId);
      
      // In a real implementation, we would call the search aggregator here
      // For now, we'll return a placeholder
      
      return { 
        success: true,
        results: []
      };
    } catch (error) {
      console.error('Error running saved search:', error);
      return { success: false, error };
    }
  }
}
