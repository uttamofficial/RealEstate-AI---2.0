import PropertyScraper from '@/components/property-scraper';

export default function ScraperPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Property Discovery
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Search and analyze real estate properties from across the web with intelligent AI insights
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl font-bold">50+</span>
                <p className="text-sm">Properties per search</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl font-bold">AI</span>
                <p className="text-sm">Powered analysis</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-2xl font-bold">Real-time</span>
                <p className="text-sm">Market data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <PropertyScraper />
        </div>
      </main>
    </div>
  );
}
