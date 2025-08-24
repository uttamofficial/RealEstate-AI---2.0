import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { MainNav } from '@/components/MainNav';
import { SiteFooter } from '@/components/SiteFooter';
import "maplibre-gl/dist/maplibre-gl.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RealEstate AI',
    template: '%s | RealEstate AI',
  },
  description: 'AI-Driven Deal Ranking and Analysis for Real Estate Investors',
  keywords: [
    'real estate',
    'AI',
    'property investment',
    'real estate analytics',
    'deal analysis'
  ],
  authors: [
    {
      name: 'RealEstate AI Team',
      url: 'https://realestate-ai.com',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <body className="min-h-screen bg-background font-sans antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <MainNav />
              <div className="flex-1">
                {children}
              </div>
              <SiteFooter />
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
