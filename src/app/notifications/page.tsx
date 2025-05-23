'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import { NotificationService } from '@/lib/api/notification-service';
import { Notification } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  
  const notificationService = new NotificationService();
  
  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };
  
  // Mark all as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };
  
  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      
      // Update local state
      setNotifications(notifications.filter(notification => notification.id !== id));
      
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };
  
  // Delete all notifications
  const deleteAllNotifications = async () => {
    if (!user || !confirm('Are you sure you want to delete all notifications?')) return;
    
    try {
      await notificationService.deleteAllNotifications(user.id);
      
      // Update local state
      setNotifications([]);
      
      toast.success('All notifications deleted');
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      toast.error('Failed to delete notifications');
    }
  };
  
  // Get filtered notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });
  
  // Format notification date
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_item':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        );
      case 'price_drop':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'system':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        );
    }
  };
  
  // Load notifications on component mount
  useEffect(() => {
    if (!user) return;
    
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const notificationService = new NotificationService();
        const fetchedNotifications = await notificationService.getNotifications(user.id, 100);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user?.id, user]);

  return (
    <div className="container py-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4 sm:mb-0">Notifications</h1>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-md shadow-sm mr-2">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                filter === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-300'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'unread' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-neutral-700 hover:text-neutral-900 border-t border-b border-neutral-300'
              }`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                filter === 'read' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-neutral-700 hover:text-neutral-900 border border-neutral-300'
              }`}
              onClick={() => setFilter('read')}
            >
              Read
            </button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.read)}
          >
            Mark All as Read
          </Button>
          
          <Button 
            variant="outline" 
            onClick={deleteAllNotifications}
            disabled={notifications.length === 0}
          >
            Clear All
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {filteredNotifications.length === 0 ? (
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">No notifications</h3>
                <p className="mt-1 text-neutral-500">
                  {filter === 'all' 
                    ? 'You have no notifications at this time.' 
                    : filter === 'unread' 
                      ? 'You have no unread notifications.'
                      : 'You have no read notifications.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`w-full transition-colors ${!notification.read ? 'border-l-4 border-l-primary-600' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium text-neutral-900">
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <Badge className="ml-2" variant="primary">New</Badge>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500 mt-1">
                            {formatDate(notification.created_at)}
                          </p>
                          {notification.data?.url && (
                            <a 
                              href={notification.data.url}
                              className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View item
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="ml-1 h-4 w-4" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-neutral-500" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
