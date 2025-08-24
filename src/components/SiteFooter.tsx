import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Globe,
  Award,
  Building,
  BarChart3,
  Brain,
  Target
} from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 text-gray-900 dark:text-white border-t border-gray-200 dark:border-slate-700">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
                RealEstate AI
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Revolutionizing real estate investment with AI-powered insights, 
              market analysis, and predictive scoring for smarter investment decisions.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Investment Deals
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Map View
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Market Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Features */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Brain className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                AI-Powered Analysis
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                Market Intelligence
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Risk Assessment
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <Target className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                Investment Scoring
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Portfolio Optimization
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Get the latest market insights and investment opportunities delivered to your inbox.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-cyan-400"
              />
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-cyan-500 dark:to-blue-600 dark:hover:from-cyan-600 dark:hover:to-blue-700 text-white">
                Subscribe
              </Button>
            </div>
            
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                <Mail className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>contact@realestateai.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                <Phone className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600 dark:text-cyan-400">12K+</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Properties Analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">96.8%</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">AI Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">$3.2B</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Investment Value</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">24/7</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">AI Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <Award className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Trusted by 15,000+ investors worldwide</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Contact Us</Link>
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} RealEstate AI. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
