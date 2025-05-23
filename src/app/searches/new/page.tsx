'use client';

import { useRouter } from 'next/navigation';
import SearchForm from '@/components/search/SearchForm';

interface SearchFormData {
  name: string;
  keywords: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  marketplaces: string[];
  notificationTypes: string[];
}

export default function NewSearchPage() {
  const router = useRouter();

  const handleCreateSearch = async (data: SearchFormData) => {
    console.log('Creating new search:', data);
    
    // Here you would make an API call to save the search
    // For now, we'll simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // After successful creation, redirect to the search list
    router.push('/searches');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Create New Search</h1>
      <SearchForm onSubmit={handleCreateSearch} />
    </div>
  );
}
