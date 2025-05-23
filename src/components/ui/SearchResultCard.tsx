'use client';

import Image from 'next/image';
import Badge from './Badge';
import { Card, CardContent, CardFooter } from './Card';
import { formatDistanceToNow } from 'date-fns';

interface SearchResultCardProps {
  title: string;
  price: number;
  image: string;
  marketplace: string;
  relevanceScore: number;
  url: string;
  createdAt: Date;
  seller?: {
    name: string;
    rating?: number;
  };
  location?: string;
  condition?: string;
}

export default function SearchResultCard({
  title,
  price,
  image,
  marketplace,
  relevanceScore,
  url,
  createdAt,
  seller,
  location,
  condition,
}: SearchResultCardProps) {
  const getMarketplaceColor = (marketplace: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
      'depop': 'primary',
      'facebook': 'secondary',
      'ebay': 'warning',
      'vinted': 'success',
      'craigslist': 'error',
    };
    
    return colors[marketplace.toLowerCase()] || 'primary';
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 8) return 'success';
    if (score >= 5) return 'warning';
    return 'default';
  };

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge 
          variant={getMarketplaceColor(marketplace)} 
          className="absolute left-2 top-2 z-10"
        >
          {marketplace}
        </Badge>
        <Badge 
          variant={getRelevanceColor(relevanceScore)} 
          className="absolute right-2 top-2 z-10"
        >
          Score: {relevanceScore}/10
        </Badge>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </div>
      <CardContent className="pt-4">
        <h4 className="text-lg font-medium line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">{title}</h4>
        <p className="text-xl font-bold text-primary-700">${price.toFixed(2)}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-neutral-500">
          {condition && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {condition}
            </span>
          )}
          
          {location && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {location}
            </span>
          )}
          
          {seller && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {seller.name}
              {seller.rating && (
                <span className="ml-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-0.5 h-3 w-3 text-warning-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {seller.rating}
                </span>
              )}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t">
        <span className="text-xs text-neutral-500">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors"
        >
          View Listing
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </CardFooter>
    </Card>
  );
}
