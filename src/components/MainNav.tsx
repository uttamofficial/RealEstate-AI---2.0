'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Menu, 
  X, 
  BarChart3, 
  Map, 
  MapPin,
  Building,
  TrendingUp, 
  Sparkles,
  User,
  Bell,
  LogOut,
  Settings,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { signOutUser } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const navItems: NavItem[] = [
  {
    name: 'Properties',
    href: '/properties',
    icon: Map,
  },
  {
    name: 'Deals',
    href: '/deals',
    icon: TrendingUp,
    badge: 'Hot'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    name: 'Map View',
    href: '/map',
    icon: MapPin,
  },
  {
    name: 'AI Assistant',
    href: '/ai-assistant',
    icon: Sparkles,
    badge: 'New'
  },
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 md:px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-lg p-1.5 sm:p-2">
                <Building className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
            </div>
            <span className="font-bold text-sm sm:text-lg lg:text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 transition-all duration-300 hidden xs:block">
              RealEstate AI
            </span>
            <span className="font-bold text-xs bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent xs:hidden">
              RE-AI
            </span>
          </Link>

          {/* Desktop Navigation - Only show when authenticated */}
          {user && (
            <nav className="hidden xl:flex items-center space-x-1 text-sm font-medium">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex items-center space-x-2 px-2 lg:px-3 py-2 rounded-lg transition-all duration-300 group hover:bg-accent/50',
                      isActive
                        ? 'text-primary bg-accent/30 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                  <Icon className={cn(
                    "h-4 w-4 transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span className="relative text-xs lg:text-sm">
                    {item.name}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    )}
                  </span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "ml-1 text-xs px-1.5 py-0.5 animate-pulse",
                        item.badge === 'New' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400'
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
          )}

          {/* Tablet Navigation - Condensed Icons Only */}
          {user && (
            <nav className="hidden lg:flex xl:hidden items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 group hover:bg-accent/50',
                    isActive
                      ? 'text-primary bg-accent/30 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  title={item.name}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
          {/* Search Bar */}
          <div className="hidden md:block relative">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
              <Input
                type="search"
                placeholder="Search deals, properties..."
                className="w-[180px] md:w-[240px] lg:w-[280px] xl:w-[360px] pl-8 md:pl-10 pr-4 py-1.5 md:py-2 text-sm rounded-full border-2 border-border/40 bg-background/50 backdrop-blur-sm focus:border-primary/50 focus:bg-background transition-all duration-300 hover:border-border/60"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-full hover:bg-accent/50 transition-all duration-300"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full hover:bg-accent/50 transition-all duration-300"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full animate-pulse"></div>
          </Button>

          {/* Theme Toggle */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {/* Authentication Section */}
          {!user && !loading && (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 text-xs sm:text-sm">
                  <LogIn className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="h-8 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <UserPlus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Profile Dropdown - Only show when authenticated */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full border-2 border-border/40 hover:border-primary/50 transition-all duration-300 group"
                >
                  <Avatar className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{user.displayName || 'User'}</p>
                    <p className="w-[180px] truncate text-xs text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer sm:hidden text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ThemeToggle />
                  Theme
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Button - Only show when authenticated */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-accent/50 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu - Only show when authenticated */}
      {isMobileMenuOpen && user && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="container py-3 sm:py-4 space-y-1 sm:space-y-2 px-2 sm:px-4 md:px-6">
            {/* Mobile Search */}
            <div className="relative mb-3 sm:mb-4 md:hidden">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search deals..."
                className="w-full pl-10 py-2.5 rounded-full border-border/40 text-sm"
              />
            </div>

            {/* Mobile Navigation */}
            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg transition-all duration-300 text-sm sm:text-base',
                      isActive
                        ? 'text-primary bg-accent/30 border-l-4 border-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs px-2 py-0.5",
                          item.badge === 'New' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Footer Actions */}
            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-border/40 flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">RealEstate AI v3.0</span>
              <div className="flex items-center space-x-2">
                <div className="sm:hidden">
                  <ThemeToggle />
                </div>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400">Online</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
