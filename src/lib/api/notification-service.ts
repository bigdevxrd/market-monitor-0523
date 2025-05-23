import { createClient } from '@supabase/supabase-js';
import { Notification, NotificationPreferences, NotificationType } from '@/types';

export class NotificationService {
  private supabase;
  
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  async getNotifications(userId: string, limit = 20): Promise<Notification[]> {
    try {
      const { data, error } = await this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
  
  async markAsRead(notificationId: string): Promise<{success: boolean, error?: any}> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error };
    }
  }
  
  async markAllAsRead(userId: string): Promise<{success: boolean, error?: any}> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error };
    }
  }
  
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await this.supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }
  }
  
  async updateNotificationPreferences(
    userId: string, 
    preferences: Partial<NotificationPreferences>
  ): Promise<{success: boolean, error?: any}> {
    try {
      const { error } = await this.supabase
        .from('notification_preferences')
        .update(preferences)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return { success: false, error };
    }
  }
  
  // For server-side use
  async createNotification(
    userId: string,
    type: NotificationType,
    message: string,
    data?: any
  ): Promise<{success: boolean, id?: string, error?: any}> {
    try {
      const notification = {
        user_id: userId,
        type,
        message,
        data,
        read: false,
        created_at: new Date().toISOString(),
      };
      
      const { data: result, error } = await this.supabase
        .from('notifications')
        .insert([notification])
        .select();
        
      if (error) throw error;
      
      return { success: true, id: result?.[0]?.id };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, error };
    }
  }
  
  // Helper to send email notifications
  async sendEmailNotification(
    userId: string, 
    subject: string, 
    message: string
  ): Promise<{success: boolean, error?: any}> {
    try {
      // In a real implementation, this would connect to an email service
      // like SendGrid, Mailgun, etc.
      console.log(`Sending email to user ${userId}: ${subject}`);
      
      // For now, just record that we attempted to send an email
      const { error } = await this.supabase
        .from('email_logs')
        .insert([{
          user_id: userId,
          subject,
          message,
          sent_at: new Date().toISOString(),
        }]);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error sending email notification:', error);
      return { success: false, error };
    }
  }
  
  // Delete a single notification
  async deleteNotification(notificationId: string): Promise<{success: boolean, error?: any}> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error };
    }
  }
  
  // Delete all notifications for a user
  async deleteAllNotifications(userId: string): Promise<{success: boolean, error?: any}> {
    try {
      const { error } = await this.supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      return { success: false, error };
    }
  }
}
