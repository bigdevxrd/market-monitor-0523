'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { SearchQuery } from '@/types';

// Define validation schema
const searchSchema = z.object({
  keywords: z.string().min(1, 'Search term is required'),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  marketplaces: z.array(z.string()).min(1, 'Select at least one marketplace'),
  sortBy: z.enum(['newest', 'price_low', 'price_high', 'relevance']),
  itemCondition: z.array(z.string()).optional(),
  location: z.string().optional(),
  distance: z.number().optional(),
  saveSearch: z.boolean().default(false),
  searchName: z.string().optional(),
  notifyWhenFound: z.boolean().default(false),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface AdvancedSearchFormProps {
  onSearch: (query: SearchQuery) => void;
  initialValues?: Partial<SearchFormValues>;
}

export function AdvancedSearchForm({ onSearch, initialValues }: AdvancedSearchFormProps) {
  const [advancedMode, setAdvancedMode] = useState(false);
  
  const defaultValues: Partial<SearchFormValues> = {
    keywords: '',
    minPrice: 0,
    maxPrice: 1000,
    marketplaces: ['depop', 'ebay', 'vinted'],
    sortBy: 'newest',
    itemCondition: [],
    location: '',
    distance: 50,
    saveSearch: false,
    searchName: '',
    notifyWhenFound: false,
    ...initialValues,
  };

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (values: SearchFormValues) => {
    // Transform form values to search query
    const query: SearchQuery = {
      ...values,
      // Add any transformations needed
    };
    
    onSearch(query);
  };

  // Toggle between simple and advanced mode
  const toggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Search Marketplaces</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Advanced</span>
                <Switch
                  checked={advancedMode}
                  onCheckedChange={toggleAdvancedMode}
                />
              </div>
            </div>
            
            {/* Basic search field - always visible */}
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What are you looking for?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. vintage leather jacket" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {/* Basic price range - always visible */}
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Min Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Max Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Marketplace selection - always visible */}
            <FormField
              control={form.control}
              name="marketplaces"
              render={() => (
                <FormItem>
                  <FormLabel>Marketplaces</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {['Depop', 'eBay', 'Vinted', 'Facebook Marketplace', 'Craigslist'].map((marketplace) => (
                      <FormField
                        key={marketplace}
                        control={form.control}
                        name="marketplaces"
                        render={({ field }) => {
                          const marketplaceValue = marketplace.toLowerCase().replace(' marketplace', '');
                          return (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(marketplaceValue)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, marketplaceValue]);
                                    } else {
                                      field.onChange(field.value?.filter(value => value !== marketplaceValue));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {marketplace}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            
            {/* Advanced options - only shown in advanced mode */}
            {advancedMode && (
              <>
                <FormField
                  control={form.control}
                  name="sortBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Results By</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="newest" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Newest
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="price_low" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Price: Low to High
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="price_high" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Price: High to Low
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="relevance" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Relevance
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="itemCondition"
                  render={() => (
                    <FormItem>
                      <FormLabel>Item Condition</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {['New', 'Like New', 'Good', 'Fair', 'Poor'].map((condition) => (
                          <FormField
                            key={condition}
                            control={form.control}
                            name="itemCondition"
                            render={({ field }) => {
                              const conditionValue = condition.toLowerCase();
                              return (
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(conditionValue)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          field.onChange([...field.value || [], conditionValue]);
                                        } else {
                                          field.onChange(field.value?.filter(value => value !== conditionValue));
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {condition}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex space-x-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City or ZIP code" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Distance (miles)</FormLabel>
                        <FormControl>
                          <div className="pt-2">
                            <Slider
                              min={5}
                              max={200}
                              step={5}
                              value={[field.value || 50]}
                              onValueChange={(value) => field.onChange(value[0])}
                            />
                            <div className="text-right mt-1">{field.value} miles</div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="saveSearch"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Save this search
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                {form.watch('saveSearch') && (
                  <FormField
                    control={form.control}
                    name="searchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My saved search" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="notifyWhenFound"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className="font-normal cursor-pointer">
                          Notify me when new items are found
                        </FormLabel>
                        <FormDescription>
                          You'll receive email notifications when new matching items are listed.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </>
            )}
            
            <Button type="submit" className="w-full">Search</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
