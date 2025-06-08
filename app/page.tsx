'use client';

import { useState, useEffect } from 'react';
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
  Globe,
  CreditCard,
  Smartphone,
  Lock,
  Award,
  TrendingDown,
  Plus,
  Eye,
  MessageCircle,
  Headphones
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    // Auto-rotate features
    const featureInterval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(featureInterval);
    };
  }, []);

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Smart Expense Tracking",
      description: "Track income and expenses with intelligent categorization and real-time insights.",
      gradient: "from-emerald-500 to-teal-600",
      demo: "Track $50 coffee expense → Auto-categorized as 'Food & Dining'"
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Financial Advisor",
      description: "Get personalized financial advice powered by OpenAI's advanced language models.",
      gradient: "from-blue-500 to-indigo-600",
      demo: "AI suggests: 'Reduce dining out by 20% to save $200/month'"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Video Consultations",
      description: "Interactive video sessions with your AI financial advisor using Tavus technology.",
      gradient: "from-purple-500 to-pink-600",
      demo: "Face-to-face AI advisor sessions for personalized guidance"
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Voice Input",
      description: "Add transactions naturally using voice commands with ElevenLabs speech recognition.",
      gradient: "from-orange-500 to-red-600",
      demo: "Say: 'I spent $25 on groceries' → Automatically added"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal Setting",
      description: "Set and track financial goals with progress monitoring and achievement rewards.",
      gradient: "from-cyan-500 to-blue-600",
      demo: "Save $5,000 for vacation → Track progress with visual indicators"
    },
    {
      icon: <Calculator className="h-8 w-8" />,
      title: "Bill Calculator",
      description: "Create detailed bills with items, taxes, and discounts for accurate calculations.",
      gradient: "from-violet-500 to-purple-600",
      demo: "Restaurant bill: $45.50 + 18% tip + 8.5% tax = $58.61"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: <Users className="h-5 w-5" />, color: "text-blue-600" },
    { number: "$10M+", label: "Money Tracked", icon: <DollarSign className="h-5 w-5" />, color: "text-emerald-600" },
    { number: "98%", label: "User Satisfaction", icon: <Star className="h-5 w-5" />, color: "text-yellow-600" },
    { number: "24/7", label: "AI Support", icon: <Bot className="h-5 w-5" />, color: "text-purple-600" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      avatar: "SJ",
      content: "FinanceAI transformed how I manage my finances. The voice input feature saves me so much time, and the AI insights helped me save $800 last month!",
      rating: 5,
      savings: "$800"
    },
    {
      name: "Mike Chen",
      role: "Software Engineer",
      avatar: "MC",
      content: "The AI video advisor feels like having a personal financial consultant. It identified spending patterns I never noticed and helped me optimize my budget.",
      rating: 5,
      savings: "$1,200"
    },
    {
      name: "Emily Rodriguez",
      role: "Small Business Owner",
      avatar: "ER",
      content: "The bill calculator and goal tracking features are perfect for managing my business expenses. The AI recommendations increased my profit margins by 15%.",
      rating: 5,
      savings: "$2,500"
    },
    {
      name: "David Park",
      role: "Marketing Manager",
      avatar: "DP",
      content: "I love how easy it is to track expenses with voice commands. Just say what I spent and it's automatically categorized. Brilliant!",
      rating: 5,
      savings: "$650"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Basic expense tracking",
        "Manual transaction entry",
        "Simple reports",
        "5 financial goals",
        "Email support"
      ],
      gradient: "from-slate-500 to-gray-600",
      popular: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "For serious financial management",
      features: [
        "Everything in Free",
        "AI financial insights",
        "Voice input (100 commands/month)",
        "Advanced analytics",
        "Unlimited goals",
        "Priority support",
        "Export data"
      ],
      gradient: "from-blue-500 to-indigo-600",
      popular: true
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "per month",
      description: "Complete AI-powered experience",
      features: [
        "Everything in Pro",
        "AI video advisor sessions",
        "Unlimited voice commands",
        "Custom categories",
        "API access",
        "White-label options",
        "24/7 phone support"
      ],
      gradient: "from-purple-500 to-pink-600",
      popular: false
    }
  ];

  const integrations = [
    { name: "OpenAI", logo: "🤖", description: "Advanced AI insights" },
    { name: "Tavus", logo: "🎥", description: "Video AI advisor" },
    { name: "ElevenLabs", logo: "🎤", description: "Voice recognition" },
    { name: "Stripe", logo: "💳", description: "Secure payments" },
    { name: "Plaid", logo: "🏦", description: "Bank connections" },
    { name: "Zapier", logo: "⚡", description: "Workflow automation" }
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
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-colors font-medium">Pricing</a>
            <a href="#testimonials" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-colors font-medium">Reviews</a>
            <a href="#about" className="text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-colors font-medium">About</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="hover:bg-white/20 dark:hover:bg-slate-800/50">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 animate-float">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20 blur-xl"></div>
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce-slow">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-30 blur-lg"></div>
        </div>
        
        <div className={`relative z-10 max-w-7xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 px-6 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Financial Revolution
          </Badge>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Your Money,
            <br />
            <span className="relative">
              Smarter
              <div className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-60"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your financial life with AI-powered insights, voice commands, video consultations, and personalized advice. 
            <span className="font-semibold text-purple-600">Join 50,000+ users</span> who've already taken control.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="h-16 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 text-lg shadow-2xl">
                <Zap className="h-6 w-6 mr-2" />
                Start Free Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-16 px-8 border-2 border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-lg group">
              <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center mb-2">
                  <div className={`p-3 rounded-full bg-gradient-to-r from-white to-slate-100 dark:from-slate-800 dark:to-slate-700 shadow-lg group-hover:shadow-xl transition-shadow ${stat.color}`}>
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

      {/* Interactive Features Showcase */}
      <section id="features" className="py-20 px-6 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200">
              <Brain className="h-4 w-4 mr-2" />
              Powerful AI Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Comprehensive financial management tools powered by cutting-edge AI technology
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  activeFeature === index
                    ? `bg-gradient-to-r ${feature.gradient} text-white shadow-lg transform scale-105`
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>

          {/* Active Feature Display */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className={`p-4 rounded-2xl bg-gradient-to-r ${features[activeFeature].gradient} w-fit`}>
                <div className="text-white">
                  {features[activeFeature].icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                {features[activeFeature].title}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                {features[activeFeature].description}
              </p>
              <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  💡 Example: {features[activeFeature].demo}
                </p>
              </div>
              <Link href="/dashboard">
                <Button className={`bg-gradient-to-r ${features[activeFeature].gradient} hover:opacity-90 text-white font-semibold transition-all duration-300 transform hover:scale-105`}>
                  Try This Feature
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
              <Card className="relative gradient-card border-0 p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
                    <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Smart Analytics</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">AI-powered spending insights</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl">
                    <Shield className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Bank-Level Security</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">256-bit encryption</p>
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

      {/* Testimonials Carousel */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200">
              <Star className="h-4 w-4 mr-2" />
              User Success Stories
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Loved by Thousands
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              See how FinanceAI has transformed the financial lives of our users
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Card className="gradient-card border-0 p-8 min-h-[300px] flex items-center">
              <div className="w-full">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      {testimonials[currentTestimonial].role}
                    </p>
                    <div className="flex gap-1 mt-2">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                      Saved {testimonials[currentTestimonial].savings}
                    </Badge>
                  </div>
                </div>
                
                <blockquote className="text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
              </div>
            </Card>

            {/* Testimonial Navigation */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 scale-125'
                      : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
              <DollarSign className="h-4 w-4 mr-2" />
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Start free and upgrade as you grow. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative gradient-card border-0 p-8 transition-all duration-300 transform hover:-translate-y-2 ${plan.popular ? 'ring-4 ring-blue-500/20 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${plan.gradient} w-fit mx-auto mb-4`}>
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-slate-800 dark:text-slate-200">
                      {plan.price}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 ml-2">
                      {plan.period}
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/dashboard">
                    <Button className={`w-full h-12 ${plan.popular ? `bg-gradient-to-r ${plan.gradient}` : 'bg-gradient-to-r from-slate-600 to-slate-700'} text-white font-semibold transition-all duration-300 transform hover:scale-105`}>
                      {plan.name === 'Free' ? 'Start Free' : 'Choose Plan'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
              <Zap className="h-4 w-4 mr-2" />
              Powerful Integrations
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Connected Ecosystem
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Seamlessly integrate with the tools and services you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="gradient-card border-0 p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl mb-4">{integration.logo}</div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {integration.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {integration.description}
                </p>
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
            <div className="absolute bottom-4 left-4 animate-bounce-slow">
              <TrendingUp className="h-6 w-6 text-emerald-300" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Ready to Transform Your Finances?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join 50,000+ users who have already taken control of their financial future with FinanceAI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="h-16 px-8 bg-white text-purple-600 hover:bg-gray-100 font-semibold transition-all duration-300 transform hover:scale-105 text-lg">
                    <Zap className="h-6 w-6 mr-2" />
                    Start Your Journey
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-16 px-8 border-2 border-white text-white hover:bg-white/10 text-lg">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Talk to Sales
                </Button>
              </div>
              <p className="text-sm text-purple-200 mt-6">
                No credit card required • Free forever plan available • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">FinanceAI</span>
              </div>
              <p className="text-slate-400 text-sm mb-6 max-w-md">
                Your smart financial companion powered by AI technology. Transform your relationship with money today.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <Headphones className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
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
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
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
              <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                <Shield className="h-3 w-3 mr-1" />
                SOC 2 Compliant
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}