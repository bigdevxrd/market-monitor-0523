'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle responsive behavior
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  const navItems: SidebarNavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      ),
    },
    {
      title: 'Searches',
      href: '/searches',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Notifications',
      href: '/notifications',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      title: 'Marketplaces',
      href: '/marketplaces',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  // Mobile sidebar rendering
  if (isMobile) {
    return (
      <>
        {/* Mobile toggle button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-40 rounded-md bg-white p-2 shadow-md text-neutral-500 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-neutral-900 bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Mobile sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white overflow-y-auto transition duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center border-b border-neutral-200 px-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg font-bold text-neutral-900">MarketMonitor</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={twMerge(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-neutral-700 hover:bg-neutral-50'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span
                  className={twMerge(
                    'mr-3',
                    pathname === item.href
                      ? 'text-primary-500'
                      : 'text-neutral-400 group-hover:text-neutral-500'
                  )}
                >
                  {item.icon}
                </span>
                {item.title}
              </Link>
            ))}
          </nav>
          <div className="border-t border-neutral-200 p-4">
            <button
              className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-neutral-50"
              onClick={() => {
                // Implement sign out functionality here
                console.log('Sign out clicked');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar rendering
  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r border-neutral-200 bg-white">
      <div className="flex h-16 items-center border-b border-neutral-200 px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-primary-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-lg font-bold text-neutral-900">MarketMonitor</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={twMerge(
              'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-primary-100 text-primary-900'
                : 'text-neutral-700 hover:bg-neutral-50'
            )}
          >
            <span
              className={twMerge(
                'mr-3',
                pathname === item.href
                  ? 'text-primary-500'
                  : 'text-neutral-500 group-hover:text-neutral-700'
              )}
            >
              {item.icon}
            </span>
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="border-t border-neutral-200 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-900">User Name</p>
            <p className="text-xs text-neutral-500">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
