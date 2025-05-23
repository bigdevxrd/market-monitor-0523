'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

interface SearchFormData {
  name: string;
  keywords: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  location?: string;
  marketplaces: string[];
  notificationTypes: string[];
  saveSearch?: boolean;
  notifyWhenFound?: boolean;
}

export default function SearchForm({ 
  onSubmit,
  defaultValues,
}: { 
  onSubmit: (data: SearchFormData) => Promise<void>;
  defaultValues?: Partial<SearchFormData>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>(
    defaultValues?.marketplaces || ['depop', 'facebook', 'ebay']
  );
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    defaultValues?.notificationTypes || ['email']
  );

  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    defaultValues?.condition || ['any']
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SearchFormData>({
    defaultValues: {
      name: defaultValues?.name || '',
      keywords: defaultValues?.keywords || '',
      minPrice: defaultValues?.minPrice,
      maxPrice: defaultValues?.maxPrice,
      condition: defaultValues?.condition || ['any'],
      location: defaultValues?.location || '',
      marketplaces: defaultValues?.marketplaces || ['depop', 'facebook', 'ebay'],
      notificationTypes: defaultValues?.notificationTypes || ['email'],
      saveSearch: defaultValues?.saveSearch !== undefined ? defaultValues.saveSearch : true,
      notifyWhenFound: defaultValues?.notifyWhenFound !== undefined ? defaultValues.notifyWhenFound : true,
    },
  });

  const handleFormSubmit = async (data: SearchFormData) => {
    setIsLoading(true);
    
    try {
      data.marketplaces = selectedMarketplaces;
      data.notificationTypes = selectedNotifications;
      data.condition = selectedConditions;
      await onSubmit(data);
      toast.success('Search saved successfully!');
    } catch (error) {
      console.error('Error saving search:', error);
      toast.error('Failed to save search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMarketplace = (marketplace: string) => {
    setSelectedMarketplaces((prev) => {
      if (prev.includes(marketplace)) {
        return prev.filter((item) => item !== marketplace);
      } else {
        return [...prev, marketplace];
      }
    });
  };

  const toggleNotificationType = (type: string) => {
    setSelectedNotifications((prev) => {
      if (prev.includes(type)) {
        return prev.filter((item) => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const toggleCondition = (condition: string) => {
    // If 'any' is selected, clear other selections
    if (condition === 'any') {
      setSelectedConditions(['any']);
      return;
    }
    
    setSelectedConditions((prev) => {
      // Remove 'any' if it's in the array and we're selecting something else
      let newConditions = prev.filter(item => item !== 'any');
      
      if (newConditions.includes(condition)) {
        newConditions = newConditions.filter((item) => item !== condition);
        // If no conditions left, default back to 'any'
        if (newConditions.length === 0) {
          return ['any'];
        }
        return newConditions;
      } else {
        return [...newConditions, condition];
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{defaultValues ? 'Edit Search' : 'Create New Search'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Search Name"
              id="name"
              placeholder="e.g., Vintage Nike Sneakers"
              error={errors.name?.message}
              {...register('name', {
                required: 'Search name is required',
              })}
            />

            <div className="space-y-1">
              <label htmlFor="keywords" className="block text-sm font-medium text-neutral-700">
                Keywords
              </label>
              <textarea
                id="keywords"
                className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                rows={3}
                placeholder="Enter keywords separated by spaces (e.g., Nike Air Max 90 vintage)"
                {...register('keywords', {
                  required: 'Keywords are required',
                })}
              />
              {errors.keywords && <p className="mt-1 text-sm text-error-500">{errors.keywords.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Min Price"
                id="minPrice"
                type="number"
                placeholder="0"
                error={errors.minPrice?.message}
                {...register('minPrice', {
                  valueAsNumber: true,
                  validate: (value) => !value || value >= 0 || 'Min price must be positive',
                })}
              />

              <Input
                label="Max Price"
                id="maxPrice"
                type="number"
                placeholder="1000"
                error={errors.maxPrice?.message}
                {...register('maxPrice', {
                  valueAsNumber: true,
                  validate: (value, formValues) => 
                    !value || 
                    !formValues.minPrice || 
                    value > formValues.minPrice || 
                    'Max price must be greater than min price',
                })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Condition
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'any', name: 'Any' },
                  { id: 'new', name: 'New' },
                  { id: 'like_new', name: 'Like New' },
                  { id: 'good', name: 'Good' },
                  { id: 'fair', name: 'Fair' },
                  { id: 'poor', name: 'Poor' },
                ].map((conditionOption) => (
                  <button
                    key={conditionOption.id}
                    type="button"
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      selectedConditions.includes(conditionOption.id)
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                    onClick={() => toggleCondition(conditionOption.id)}
                  >
                    {selectedConditions.includes(conditionOption.id) && (
                      <svg
                        className="-ml-0.5 mr-1.5 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {conditionOption.name}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Location (optional)"
              id="location"
              placeholder="e.g., New York, NY"
              error={errors.location?.message}
              {...register('location')}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Marketplaces
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'depop', name: 'Depop' },
                  { id: 'facebook', name: 'Facebook Marketplace' },
                  { id: 'ebay', name: 'eBay' },
                  { id: 'vinted', name: 'Vinted' },
                  { id: 'craigslist', name: 'Craigslist' },
                ].map((marketplace) => (
                  <button
                    key={marketplace.id}
                    type="button"
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      selectedMarketplaces.includes(marketplace.id)
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                    onClick={() => toggleMarketplace(marketplace.id)}
                  >
                    {selectedMarketplaces.includes(marketplace.id) && (
                      <svg
                        className="-ml-0.5 mr-1.5 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {marketplace.name}
                  </button>
                ))}
              </div>
              {selectedMarketplaces.length === 0 && (
                <p className="mt-1 text-sm text-error-500">Select at least one marketplace</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                Notification Types
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'email', name: 'Email' },
                  { id: 'push', name: 'Push Notification' },
                  { id: 'sms', name: 'SMS' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      selectedNotifications.includes(type.id)
                        ? 'bg-secondary-100 text-secondary-800'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                    onClick={() => toggleNotificationType(type.id)}
                  >
                    {selectedNotifications.includes(type.id) && (
                      <svg
                        className="-ml-0.5 mr-1.5 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {type.name}
                  </button>
                ))}
              </div>
              {selectedNotifications.length === 0 && (
                <p className="mt-1 text-sm text-error-500">Select at least one notification type</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  id="saveSearch"
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  {...register('saveSearch')}
                />
                <label htmlFor="saveSearch" className="text-sm font-medium text-neutral-700">
                  Save this search for future use
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="notifyWhenFound"
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  {...register('notifyWhenFound')}
                />
                <label htmlFor="notifyWhenFound" className="text-sm font-medium text-neutral-700">
                  Notify me when new items matching this search are found
                </label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isLoading}
            disabled={selectedMarketplaces.length === 0 || selectedNotifications.length === 0}
          >
            {defaultValues ? 'Update Search' : 'Create Search'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
