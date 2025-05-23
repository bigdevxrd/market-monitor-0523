'use client';

import { createContext, useContext, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function Tabs({ 
  children, 
  defaultValue, 
  className 
}: { 
  children: React.ReactNode; 
  defaultValue: string;
  className?: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={twMerge("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={twMerge("flex space-x-1 border-b border-neutral-200", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ 
  value, 
  children, 
  className 
}: { 
  value: string; 
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={twMerge(
        "px-4 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "border-b-2 border-primary-500 text-primary-600" 
          : "text-neutral-600 hover:text-neutral-800",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ 
  value, 
  children, 
  className 
}: { 
  value: string; 
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  
  const { activeTab } = context;
  
  if (activeTab !== value) return null;

  return (
    <div className={twMerge("mt-4", className)}>
      {children}
    </div>
  );
}
