import Link from "next/link";
import Logo from "@/components/icons/logo";
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
  Award
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                RealEstate AI
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Revolutionizing real estate investment with AI-powered insights, 
              market analysis, and predictive scoring for smarter decisions.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/scraper" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Property Scraper
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Map View
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Market Reports
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  Investment Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">AI Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-300">
                <Zap className="w-4 h-4 text-cyan-400" />
                AI-Powered Analysis
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Market Intelligence
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Shield className="w-4 h-4 text-purple-400" />
                Risk Assessment
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Users className="w-4 h-4 text-blue-400" />
                Expert Insights
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Globe className="w-4 h-4 text-indigo-400" />
                Global Coverage
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-gray-300 text-sm">
              Get the latest market insights and investment opportunities delivered to your inbox.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
              />
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                Subscribe
              </Button>
            </div>
            
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>contact@realestateai.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-cyan-400">10K+</div>
              <div className="text-gray-400 text-sm">Properties Analyzed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-400">95%</div>
              <div className="text-gray-400 text-sm">Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-400">$2.5B</div>
              <div className="text-gray-400 text-sm">Investment Value</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-gray-400 text-sm">AI Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Trusted by 10,000+ investors worldwide</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</Link>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 RealEstate AI. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
