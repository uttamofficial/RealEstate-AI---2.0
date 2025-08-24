'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InsightsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to analytics page since insights are now combined with analytics
    router.replace('/analytics');
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Analytics & Insights...</h1>
                  <p className="text-muted-foreground">Real estate market doesn&apos;t wait for anyone. Make your move today.</p>
      </div>
    </div>
  );
}
