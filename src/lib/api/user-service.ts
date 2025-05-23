import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '@/types';

export class UserService {
  private supabase;
  
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
  
  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<{success: boolean, error: any | null}> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .update(profile)
        .eq('id', userId);
        
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error };
    }
  }
  
  async createUserProfile(profile: UserProfile): Promise<{success: boolean, error: any | null}> {
    try {
      const { error } = await this.supabase
        .from('profiles')
        .insert([profile]);
        
      if (error) throw error;
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error };
    }
  }
}
