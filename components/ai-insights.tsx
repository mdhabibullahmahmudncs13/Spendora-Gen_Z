'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Expense } from '@/types';
import { Bot, Sparkles, TrendingUp, Target, AlertTriangle, Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface FinancialInsight {
  type: 'tip' | 'warning' | 'opportunity' | 'goal';
  title: string;
  message: string;
  category?: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
}

interface SpendingAnalysis {
  insights: FinancialInsight[];
  monthlyBudgetSuggestion: number;
  topSpendingCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  savingsOpportunities: Array<{
    category: string;
    potentialSavings: number;
    suggestion: string;
  }>;
  financialScore: number;
}

interface AIInsightsProps {
  expenses: Expense[];
}

export function AIInsights({ expenses }: AIInsightsProps) {
  const [analysis, setAnalysis] = useState<SpendingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [personalizedTip, setPersonalizedTip] = useState<string>('');
  const [tipLoading, setTipLoading] = useState(false);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'goal': return <Target className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string, impact: string) => {
    const baseColors = {
      tip: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800',
      warning: 'from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200 dark:border-red-800',
      opportunity: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800',
      goal: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800'
    };
    return baseColors[type as keyof typeof baseColors] || baseColors.tip;
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      low: 'bg-slate-100 text-slate-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    return colors[impact as keyof typeof colors] || colors.medium;
  };

  const analyzeSpending = async () => {
    if (expenses.length === 0) {
      toast.error('Add some expenses first to get AI insights!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze-spending', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenses }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to analyze spending');
      }

      const data = await response.json();
      setAnalysis(data);
      toast.success('AI analysis complete! 🎉');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze spending patterns');
    } finally {
      setLoading(false);
    }
  };

  const generateTip = async () => {
    if (expenses.length === 0) {
      toast.error('Add some expenses first to get personalized tips!');
      return;
    }

    setTipLoading(true);
    try {
      const response = await fetch('/api/financial-tip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenses }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate tip');
      }

      const data = await response.json();
      setPersonalizedTip(data.tip);
      toast.success('New tip generated! 💡');
    } catch (error) {
      console.error('Tip generation error:', error);
      toast.error('Failed to generate personalized tip');
    } finally {
      setTipLoading(false);
    }
  };

  // Auto-generate tip when component mounts
  useEffect(() => {
    if (expenses.length > 0 && !personalizedTip) {
      generateTip();
    }
  }, [expenses.length]);

  return (
    <div className="space-y-6">
      {/* Quick Tip Card */}
      <Card className="gradient-card border-2 border-dashed border-purple-300 dark:border-purple-600 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Financial Tips
            </span>
          </CardTitle>
          <CardDescription>
            Get personalized insights based on your spending patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personalizedTip ? (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  💡 {personalizedTip}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900/20 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Add some expenses to get personalized AI tips!
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={generateTip} 
                disabled={tipLoading || expenses.length === 0}
                variant="outline" 
                className="flex-1 group hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-600 hover:text-white transition-all duration-300"
              >
                {tipLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2 group-hover:animate-spin" />
                )}
                {tipLoading ? 'Generating...' : 'Get New Tip'}
              </Button>
              
              <Button 
                onClick={analyzeSpending} 
                disabled={loading || expenses.length === 0}
                variant="outline" 
                className="group hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-600 hover:text-white transition-all duration-300"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 group-hover:animate-spin" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      {analysis && (
        <Card className="gradient-card hover:shadow-2xl transition-all duration-300 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                AI Spending Analysis
              </span>
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700">
                Financial Score: {analysis.financialScore}/100
              </Badge>
            </CardTitle>
            <CardDescription className="text-base">
              Comprehensive analysis of your spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Insights */}
              <div className="grid gap-4">
                {analysis.insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-6 bg-gradient-to-r ${getInsightColor(insight.type, insight.impact)} border-2 rounded-2xl`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        {insight.title}
                      </h4>
                      <Badge variant="outline" className={getImpactBadge(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200">
                      {insight.message}
                    </p>
                    {insight.category && (
                      <Badge variant="secondary" className="mt-2">
                        {insight.category}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Budget Suggestion */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  💰 Recommended Monthly Budget
                </h4>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  ${analysis.monthlyBudgetSuggestion.toFixed(2)}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                  Based on your spending patterns and financial goals
                </p>
              </div>

              {/* Savings Opportunities */}
              {analysis.savingsOpportunities.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Savings Opportunities
                  </h4>
                  {analysis.savingsOpportunities.map((opportunity, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-emerald-800 dark:text-emerald-200">
                          {opportunity.category}
                        </span>
                        <Badge className="bg-emerald-100 text-emerald-700">
                          Save ${opportunity.potentialSavings.toFixed(2)}/month
                        </Badge>
                      </div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        {opportunity.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}