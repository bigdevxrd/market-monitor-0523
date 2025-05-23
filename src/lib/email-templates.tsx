import { Notification, UserProfile, SearchResult } from '@/types';

interface EmailTemplateProps {
  userProfile?: UserProfile;
  notification?: Notification;
  searchResult?: SearchResult;
  searchName?: string;
  priceDropAmount?: number;
  originalPrice?: number;
  newPrice?: number;
}

/**
 * Email Templates for different notification types
 */
export const EmailTemplates = {
  /**
   * Welcome email sent when a user first registers
   */
  welcome: (props: EmailTemplateProps) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to Market Monitor</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
        <p>Hello ${props.userProfile?.firstName || 'there'},</p>
        <p>Thank you for joining Market Monitor! We're excited to help you find the best deals across multiple marketplaces.</p>
        <p>With Market Monitor, you can:</p>
        <ul>
          <li>Search across Depop, Facebook Marketplace, eBay, Vinted, and Craigslist simultaneously</li>
          <li>Save searches and get notified when new items are posted</li>
          <li>Track price drops on items you're watching</li>
          <li>Analyze price trends to find the best time to buy</li>
        </ul>
        <p>To get started, create your first search and set up notifications.</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/searches/new" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Create Your First Search</a>
        </div>
        <p style="margin-top: 20px;">Happy hunting!</p>
        <p>The Market Monitor Team</p>
      </div>
      <div style="padding: 10px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Market Monitor. All rights reserved.</p>
        <p>You're receiving this email because you signed up for Market Monitor.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #6b7280;">Manage email preferences</a></p>
      </div>
    </div>
  `,
  
  /**
   * New item notification when a search finds new matching items
   */
  newItem: (props: EmailTemplateProps) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Item Found!</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
        <p>Hello ${props.userProfile?.firstName || 'there'},</p>
        <p>Good news! We found a new item matching your "${props.searchName}" search:</p>
        <div style="border: 1px solid #e5e7eb; border-radius: 5px; padding: 15px; margin: 20px 0; background-color: white;">
          ${props.searchResult?.image ? `
            <img src="${props.searchResult.image}" style="width: 100%; max-height: 300px; object-fit: contain; margin-bottom: 15px;" alt="${props.searchResult.title}" />
          ` : ''}
          <h2 style="margin: 0 0 10px 0; color: #111827;">${props.searchResult?.title}</h2>
          <p style="font-size: 20px; font-weight: bold; color: #4F46E5; margin: 10px 0;">$${props.searchResult?.price.toFixed(2)}</p>
          <p style="margin: 5px 0; color: #6b7280;">
            <strong>Marketplace:</strong> ${props.searchResult?.marketplace}
          </p>
          ${props.searchResult?.condition ? `
            <p style="margin: 5px 0; color: #6b7280;">
              <strong>Condition:</strong> ${props.searchResult.condition}
            </p>
          ` : ''}
          ${props.searchResult?.location ? `
            <p style="margin: 5px 0; color: #6b7280;">
              <strong>Location:</strong> ${props.searchResult.location}
            </p>
          ` : ''}
          <div style="text-align: center; margin-top: 15px;">
            <a href="${props.searchResult?.url || '#'}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Item</a>
          </div>
        </div>
        <p>Don't miss out on this opportunity!</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/searches/results?searchId=${props.notification?.data?.searchId || ''}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View All Results</a>
        </div>
      </div>
      <div style="padding: 10px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Market Monitor. All rights reserved.</p>
        <p>You're receiving this email because you set up notifications for this search.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #6b7280;">Manage email preferences</a></p>
      </div>
    </div>
  `,
  
  /**
   * Price drop notification when an item's price has decreased
   */
  priceDrop: (props: EmailTemplateProps) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Price Drop Alert!</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
        <p>Hello ${props.userProfile?.firstName || 'there'},</p>
        <p>Great news! An item you've been watching has dropped in price:</p>
        <div style="border: 1px solid #e5e7eb; border-radius: 5px; padding: 15px; margin: 20px 0; background-color: white;">
          ${props.searchResult?.image ? `
            <img src="${props.searchResult.image}" style="width: 100%; max-height: 300px; object-fit: contain; margin-bottom: 15px;" alt="${props.searchResult.title}" />
          ` : ''}
          <h2 style="margin: 0 0 10px 0; color: #111827;">${props.searchResult?.title}</h2>
          <div style="display: flex; align-items: center; justify-content: center; margin: 15px 0;">
            <p style="font-size: 18px; text-decoration: line-through; color: #6b7280; margin: 0 10px;">$${props.originalPrice?.toFixed(2)}</p>
            <p style="font-size: 22px; font-weight: bold; color: #10B981; margin: 0 10px;">$${props.newPrice?.toFixed(2)}</p>
            <p style="font-size: 16px; background-color: #D1FAE5; color: #047857; padding: 3px 8px; border-radius: 12px; margin: 0 10px;">-$${props.priceDropAmount?.toFixed(2)} (${Math.round((props.priceDropAmount || 0) / (props.originalPrice || 1) * 100)}% off)</p>
          </div>
          <p style="margin: 5px 0; color: #6b7280;">
            <strong>Marketplace:</strong> ${props.searchResult?.marketplace}
          </p>
          <div style="text-align: center; margin-top: 15px;">
            <a href="${props.searchResult?.url || '#'}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Item</a>
          </div>
        </div>
        <p>This price drop might not last long, act quickly to secure this deal!</p>
      </div>
      <div style="padding: 10px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Market Monitor. All rights reserved.</p>
        <p>You're receiving this email because you're watching this item.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #6b7280;">Manage email preferences</a></p>
      </div>
    </div>
  `,
  
  /**
   * Weekly digest of new items and price changes
   */
  weeklyDigest: (props: EmailTemplateProps) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Your Weekly Market Update</h1>
      </div>
      <div style="padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
        <p>Hello ${props.userProfile?.firstName || 'there'},</p>
        <p>Here's your weekly summary of marketplace activity for your saved searches:</p>
        
        <h2 style="margin: 20px 0 10px 0; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">New Items Found (12)</h2>
        <p>Your searches have found 12 new items this week. Here are some highlights:</p>
        
        <!-- This would be dynamically generated with actual items -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 15px 0;">
          <div style="border: 1px solid #e5e7eb; border-radius: 5px; padding: 10px; background-color: white;">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" style="width: 100%; height: 120px; object-fit: cover;" />
            <p style="font-weight: bold; margin: 5px 0; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Nike Air Max 90</p>
            <p style="color: #4F46E5; margin: 5px 0; font-weight: bold;">$95</p>
          </div>
          <div style="border: 1px solid #e5e7eb; border-radius: 5px; padding: 10px; background-color: white;">
            <img src="https://images.unsplash.com/photo-1597045566677-8cf032ed6634" style="width: 100%; height: 120px; object-fit: cover;" />
            <p style="font-weight: bold; margin: 5px 0; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Nike Dunk Low Retro</p>
            <p style="color: #4F46E5; margin: 5px 0; font-weight: bold;">$110</p>
          </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/searches" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View All New Items</a>
        </div>
        
        <h2 style="margin: 30px 0 10px 0; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Price Drops (5)</h2>
        <p>5 items you're watching have dropped in price this week:</p>
        
        <!-- This would be dynamically generated with actual items -->
        <div style="border: 1px solid #e5e7eb; border-radius: 5px; padding: 15px; margin: 15px 0; background-color: white;">
          <div style="display: flex; align-items: center;">
            <img src="https://images.unsplash.com/photo-1520256862855-398228c41684" style="width: 80px; height: 80px; object-fit: cover; margin-right: 15px;" />
            <div>
              <p style="font-weight: bold; margin: 0 0 5px 0;">Vintage Nike Air Max 95</p>
              <div style="display: flex; align-items: center;">
                <p style="text-decoration: line-through; color: #6b7280; margin: 0 10px 0 0;">$195</p>
                <p style="color: #10B981; font-weight: bold; margin: 0;">$175</p>
                <span style="background-color: #D1FAE5; color: #047857; padding: 2px 6px; border-radius: 10px; font-size: 12px; margin-left: 10px;">-$20</span>
              </div>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Your Dashboard</a>
        </div>
        
        <p style="margin-top: 20px;">Happy hunting!</p>
        <p>The Market Monitor Team</p>
      </div>
      <div style="padding: 10px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Market Monitor. All rights reserved.</p>
        <p>You're receiving this weekly digest based on your notification preferences.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="color: #6b7280;">Manage email preferences</a></p>
      </div>
    </div>
  `,
};
