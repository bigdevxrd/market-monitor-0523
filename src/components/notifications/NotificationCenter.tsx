'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/auth-context';
import { NotificationService } from '@/lib/api/notification-service';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const notificationService = new NotificationService();
  
  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const fetchedNotifications = await notificationService.getNotifications(user.id);
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all as read
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Load notifications when popover opens or user changes
  useEffect(() => {
    if (isOpen || !notifications.length) {
      fetchNotifications();
    }
  }, [isOpen, user?.id]);
  
  // Poll for new notifications periodically when logged in
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user?.id]);
  
  // Render the notification icon with badge
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <span className="loading">Loading notifications...</span>
              </div>
            )}
            
            {!isLoading && notifications.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No notifications yet
              </div>
            )}
            
            {!isLoading && notifications.length > 0 && (
              <ScrollArea className="h-[300px]">
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 ${!notification.read ? 'bg-muted/30' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-sm font-medium leading-none mb-1">
                            {notification.message}
                          </p>
                          {notification.data?.url && (
                            <a 
                              href={notification.data.url}
                              className="text-xs text-blue-500 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View item →
                            </a>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        
                        {!notification.read && (
                          <Badge variant="secondary" className="h-2 w-2 rounded-full p-0 bg-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
