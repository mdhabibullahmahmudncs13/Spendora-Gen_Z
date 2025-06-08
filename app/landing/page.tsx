'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Sparkles, 
  TrendingUp, 
  Target, 
  Bot, 
  Video, 
  Mic, 
  Calculator,
  BarChart3,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Users,
  DollarSign,
  PieChart,
  Brain,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Smart Expense Tracking",
      description: "Track income and expenses with intelligent categorization and real-time insights.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Financial Advisor",
      description: "Get personalized financial advice powered by OpenAI's advanced language models.",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Video Consultations",
      description: "Interactive video sessions with your AI financial advisor using Tavus technology.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Voice Input",
      description: "Add transactions naturally using voice commands with ElevenLabs speech recognition.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal Setting",
      description: "Set and track financial goals with progress monitoring and achievement rewards.",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: <Calculator className="h-8 w-8" />,
      title: "Bill Calculator",
      description: "Create detailed bills with items, taxes, and discounts for accurate calculations.",
      gradient: "from-violet-500 to-purple-600"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users", icon: <Users className="h-5 w-5" /> },
    { number: "$2M+", label: "Money Tracked", icon: <DollarSign className="h-5 w-5" /> },
    { number: "95%", label: "User Satisfaction", icon: <Star className="h-5 w-5" /> },
    { number: "24/7", label: "AI Support", icon: <Bot className="h-5 w-5" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      avatar: "SJ",
      content: "FinanceAI transformed how I manage my finances. The voice input feature saves me so much time!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Software Engineer",
      avatar: "MC",
      content: "The AI insights helped me identify spending patterns I never noticed. Saved $500 last month!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      avatar: "ER",
      content: "The bill calculator and goal tracking features are perfect for managing my business expenses.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Navigation */}
      <nav className="glass-effect border-b border-white/20 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Wallet className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FinanceAI
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Smart Financial Advisor</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="hover:bg-white/20 dark:hover:bg-slate-800/50">
              Features
            </Button>
            <Button variant="ghost" className="hover:bg-white/20 dark:hover:bg-slate-800/50">
              Pricing
            </Button>
            <Button variant="ghost" className="hover:bg-white/20 dark:hover:bg-slate-800/50">
              About
            </Button>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute top-10 right-10 animate-float">
          <Sparkles className="h-16 w-16 text-yellow-400 opacity-60" />
        </div>
        <div className="absolute bottom-10 left-10 animate-bounce-slow">
          <TrendingUp className="h-12 w-12 text-emerald-500 opacity-60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 px-6 py-2">
            <Bot className="h-4 w-4 mr-2" />
            AI-Powered Financial Management
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Your Smart
            <br />
            Financial Future
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your financial life with AI-powered insights, voice commands, and personalized advice. 
            Track expenses, set goals, and make smarter money decisions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/">
              <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 text-lg">
                <Zap className="h-5 w-5 mr-2" />
                Start Free Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-lg">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white mr-2">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200">{stat.number}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200">
              <Sparkles className="h-4 w-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Comprehensive financial management tools powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardHeader>
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} w-fit mb-4`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Integration Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200">
                <Brain className="h-4 w-4 mr-2" />
                AI Technology
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Powered by Advanced AI
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Our platform integrates with industry-leading AI services to provide you with intelligent financial insights and seamless user experiences.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">OpenAI Integration</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Advanced language models for financial insights</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Tavus Video AI</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Interactive video consultations with AI advisors</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">ElevenLabs Voice</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Natural voice commands for expense tracking</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-3xl"></div>
              <Card className="relative gradient-card border-0 p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
                    <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Smart Analytics</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">AI-powered spending insights</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl">
                    <Shield className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Secure & Private</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Bank-level security standards</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                    <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Goal Tracking</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Achieve financial milestones</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl">
                    <Globe className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Multi-Currency</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Global currency support</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200">
              <Star className="h-4 w-4 mr-2" />
              User Reviews
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Loved by Thousands
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              See what our users are saying about their financial transformation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="gradient-card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{testimonial.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-12 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20"></div>
            <div className="absolute top-4 right-4 animate-float">
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Finances?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have already taken control of their financial future with FinanceAI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button size="lg" className="h-14 px-8 bg-white text-purple-600 hover:bg-gray-100 font-semibold transition-all duration-300 transform hover:scale-105 text-lg">
                    <Zap className="h-5 w-5 mr-2" />
                    Get Started Free
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-white text-white hover:bg-white/10 text-lg">
                  <Video className="h-5 w-5 mr-2" />
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm text-purple-200 mt-6">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">FinanceAI</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your smart financial companion powered by AI technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 FinanceAI. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                <Zap className="h-3 w-3 mr-1" />
                Built with Bolt
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}