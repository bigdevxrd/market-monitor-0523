import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
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
          </div>
          <nav className="hidden space-x-6 sm:flex">
            <Link href="#features" className="text-sm font-medium text-neutral-700 hover:text-primary-600">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-neutral-700 hover:text-primary-600">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium text-neutral-700 hover:text-primary-600">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-sm font-medium text-neutral-700 hover:text-primary-600">
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
                <span className="block text-primary-600">AI-Powered</span>
                <span className="block">Marketplace Monitoring</span>
              </h1>
              <p className="mt-4 text-lg text-neutral-600 sm:mt-6">
                Never miss a deal again. Get instant notifications for items across Depop, Facebook Marketplace, 
                eBay, Vinted, and Craigslist with our AI-powered matching technology.
              </p>
              <div className="mt-6 flex flex-col space-y-4 sm:mt-8 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-primary-600 px-6 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-primary-700"
                >
                  Start for free
                </Link>
                <Link
                  href="#how-it-works"
                  className="rounded-md border border-neutral-300 bg-white px-6 py-3 text-center text-base font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
                >
                  Learn more
                </Link>
              </div>
            </div>
            <div className="relative lg:mt-0">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <div className="aspect-w-16 aspect-h-9 relative h-80 sm:h-96 lg:h-full">
                    {/* Placeholder for dashboard image - replace with actual image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-lg font-medium">
                      AI-Powered Dashboard Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-neutral-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Powerful Features for Marketplace Hunters
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Our AI-powered platform helps you find the best deals across multiple marketplaces.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-neutral-900">Multi-Platform Search</h3>
              <p className="mt-2 text-neutral-600">
                Monitor Depop, Facebook Marketplace, eBay, Vinted, and Craigslist simultaneously from a single dashboard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-neutral-900">AI Matching</h3>
              <p className="mt-2 text-neutral-600">
                Our Claude-powered AI analyzes listings for relevance, giving each match a score from 1-10 to save you time.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-neutral-900">Instant Notifications</h3>
              <p className="mt-2 text-neutral-600">
                Receive alerts via push, email, or SMS within 30 seconds of new listings that match your criteria.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-neutral-900">Smart Filters</h3>
              <p className="mt-2 text-neutral-600">
                Narrow your search with filters for price, location, condition, and seller rating to find exactly what you want.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-neutral-900">Saved Searches</h3>
              <p className="mt-2 text-neutral-600">
                Store and manage multiple search criteria to track different items simultaneously without starting over.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-neutral-900">First-to-See Advantage</h3>
              <p className="mt-2 text-neutral-600">
                Beat the competition by being the first to know when new items matching your criteria hit the market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Get started in minutes and never miss a marketplace deal again.
            </p>
          </div>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm font-medium text-neutral-500">Simple 4-step process</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 bg-white">
                  <span className="text-sm font-medium text-primary-600">1</span>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
                  <h3 className="text-lg font-medium text-neutral-900">Sign Up</h3>
                  <p className="mt-2 text-neutral-600">
                    Create an account with your email or Google to get started.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 bg-white">
                  <span className="text-sm font-medium text-primary-600">2</span>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
                  <h3 className="text-lg font-medium text-neutral-900">Create Search</h3>
                  <p className="mt-2 text-neutral-600">
                    Define your search criteria with keywords, price range, and other filters.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 bg-white">
                  <span className="text-sm font-medium text-primary-600">3</span>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
                  <h3 className="text-lg font-medium text-neutral-900">Set Notifications</h3>
                  <p className="mt-2 text-neutral-600">
                    Choose how you want to be notified: push, email, or SMS.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 bg-white">
                  <span className="text-sm font-medium text-primary-600">4</span>
                </div>
                <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-soft">
                  <h3 className="text-lg font-medium text-neutral-900">Get Deals</h3>
                  <p className="mt-2 text-neutral-600">
                    Receive instant alerts and be the first to see matching listings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-neutral-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
              Choose the plan that works best for your marketplace hunting needs.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Free Plan */}
            <div className="flex flex-col rounded-lg border border-neutral-200 bg-white shadow-soft transition-all hover:shadow-soft-md">
              <div className="border-b border-neutral-200 p-6">
                <h3 className="text-lg font-medium text-neutral-900">Free</h3>
                <p className="mt-4 flex items-baseline text-neutral-900">
                  <span className="text-5xl font-bold tracking-tight">$0</span>
                  <span className="ml-1 text-xl font-medium">/month</span>
                </p>
                <p className="mt-4 text-sm text-neutral-600">
                  Perfect for casual marketplace browsers.
                </p>
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">3 saved searches</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">Email notifications only</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">2 marketplaces</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">Basic AI matching</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    href="/auth/signup"
                    className="block w-full rounded-md border border-primary-600 bg-white px-4 py-2 text-center text-sm font-medium text-primary-600 hover:bg-primary-50"
                  >
                    Get started for free
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative flex flex-col rounded-lg border-2 border-primary-600 bg-white shadow-soft-md transition-all hover:shadow-soft-lg">
              <div className="absolute -top-4 right-0 left-0 mx-auto w-32 rounded-full bg-primary-600 px-3 py-1 text-center text-sm font-medium text-white">
                Most Popular
              </div>
              <div className="border-b border-neutral-200 p-6">
                <h3 className="text-lg font-medium text-neutral-900">Pro</h3>
                <p className="mt-4 flex items-baseline text-neutral-900">
                  <span className="text-5xl font-bold tracking-tight">$9.99</span>
                  <span className="ml-1 text-xl font-medium">/month</span>
                </p>
                <p className="mt-4 text-sm text-neutral-600">
                  Perfect for serious marketplace hunters.
                </p>
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">25 saved searches</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">All notification types (Push, Email, SMS)</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">All 5 marketplaces</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">Advanced AI matching</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">30-second notification speed</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    href="/auth/signup?plan=pro"
                    className="block w-full rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-700"
                  >
                    Start Pro plan
                  </Link>
                </div>
              </div>
            </div>

            {/* Business Plan */}
            <div className="flex flex-col rounded-lg border border-neutral-200 bg-white shadow-soft transition-all hover:shadow-soft-md">
              <div className="border-b border-neutral-200 p-6">
                <h3 className="text-lg font-medium text-neutral-900">Business</h3>
                <p className="mt-4 flex items-baseline text-neutral-900">
                  <span className="text-5xl font-bold tracking-tight">$29.99</span>
                  <span className="ml-1 text-xl font-medium">/month</span>
                </p>
                <p className="mt-4 text-sm text-neutral-600">
                  Perfect for professional resellers and businesses.
                </p>
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">Unlimited saved searches</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">Priority notifications</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">API access</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">Advanced analytics</p>
                  </div>
                  <div className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-success-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <p className="ml-3 text-neutral-700">Auto-purchase capabilities</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link
                    href="/auth/signup?plan=business"
                    className="block w-full rounded-md border border-primary-600 bg-white px-4 py-2 text-center text-sm font-medium text-primary-600 hover:bg-primary-50"
                  >
                    Start Business plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center space-x-2">
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
              </div>
              <p className="text-base text-neutral-600">
                AI-powered marketplace monitoring for Depop, Facebook Marketplace, eBay, Vinted, and Craigslist.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-neutral-400 hover:text-neutral-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-neutral-400 hover:text-neutral-500">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Product</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#features" className="text-base text-neutral-600 hover:text-neutral-900">
                        Features
                      </a>
                    </li>
                    <li>
                      <a href="#pricing" className="text-base text-neutral-600 hover:text-neutral-900">
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                        API
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                        Guides
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                        Careers
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-neutral-600 hover:text-neutral-900">
                        Terms
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-neutral-200 pt-8">
            <p className="text-base text-neutral-500 xl:text-center">
              &copy; {new Date().getFullYear()} MarketMonitor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
