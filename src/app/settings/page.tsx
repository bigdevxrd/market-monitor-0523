'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import { UserService } from '@/lib/api/user-service';
import { NotificationService } from '@/lib/api/notification-service';
import { UserProfile, NotificationPreferences } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>();
  
  const userService = new UserService();
  const notificationService = new NotificationService();
  
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        const userProfile = await userService.getUserProfile(user.id);
        const notificationPrefs = await notificationService.getNotificationPreferences(user.id);
        
        if (userProfile) {
          setValue('firstName', userProfile.firstName || '');
          setValue('lastName', userProfile.lastName || '');
          setValue('email', userProfile.email);
          setValue('phone', userProfile.phone || '');
        }
        
        if (notificationPrefs) {
          setValue('emailNotifications', notificationPrefs.email_enabled);
          setValue('pushNotifications', notificationPrefs.push_enabled);
          setValue('smsNotifications', notificationPrefs.sms_enabled);
        } else {
          // Default values
          setValue('emailNotifications', true);
          setValue('pushNotifications', true);
          setValue('smsNotifications', false);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile information');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, [user, setValue, notificationService, userService]);
  
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // Update user profile
      const profileData: Partial<UserProfile> = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      };
      
      await userService.updateUserProfile(user.id, profileData);
      
      // Update notification preferences
      const notificationPrefs: Partial<NotificationPreferences> = {
        email_enabled: data.emailNotifications,
        push_enabled: data.pushNotifications,
        sms_enabled: data.smsNotifications,
      };
      
      await notificationService.updateNotificationPreferences(user.id, notificationPrefs);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  id="firstName"
                  error={errors.firstName?.message}
                  {...register('firstName', {
                    required: 'First name is required',
                  })}
                />
                <Input
                  label="Last Name"
                  id="lastName"
                  error={errors.lastName?.message}
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                />
              </div>
              
              <Input
                label="Email Address"
                id="email"
                type="email"
                disabled
                {...register('email')}
              />
              
              <Input
                label="Phone Number"
                id="phone"
                placeholder="+1 (555) 123-4567"
                error={errors.phone?.message}
                {...register('phone', {
                  pattern: {
                    value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                    message: 'Invalid phone number format',
                  },
                })}
              />
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-neutral-500">Receive notifications via email</p>
                </div>
                <div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    {...register('emailNotifications')} 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-neutral-500">Receive notifications in the browser</p>
                </div>
                <div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    {...register('pushNotifications')} 
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className="text-sm text-neutral-500">Receive notifications via text message</p>
                </div>
                <div>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    {...register('smsNotifications')} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" isLoading={isSaving}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-neutral-500">Update your password</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Implement password change modal or redirect
                    toast.success('Password change functionality coming soon!');
                  }}
                >
                  Change Password
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-neutral-500">Add an extra layer of security</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Implement 2FA setup
                    toast.success('2FA setup coming soon!');
                  }}
                >
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-neutral-500">
                    Once deleted, your account cannot be recovered.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    // Implement account deletion confirmation
                    toast.error('Account deletion coming soon!');
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
