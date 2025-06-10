import OpenAI from 'openai';

// Check if OpenAI API key is properly configured
const isOpenAIConfigured = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  return apiKey && apiKey !== 'your_openai_api_key' && apiKey !== 'your_openai_api_key_here' && apiKey.startsWith('sk-');
};

const openai = isOpenAIConfigured() ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export interface FinancialInsight {
  type: 'tip' | 'warning' | 'opportunity' | 'goal';
  title: string;
  message: string;
  category?: string;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
}

export interface SpendingAnalysis {
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

function createFallbackAnalysis(expenses: any[], totalSpending: number, topCategories: any[]): SpendingAnalysis {
  const insights: FinancialInsight[] = [];
  
  if (expenses.length === 0) {
    insights.push({
      type: 'tip',
      title: 'Start Your Financial Journey',
      message: 'Begin by tracking your daily expenses to understand your spending patterns and identify opportunities for improvement.',
      impact: 'high',
      actionable: true
    });
  } else {
    // Spending analysis
    if (totalSpending > 0) {
      insights.push({
        type: 'tip',
        title: 'Monthly Spending Overview',
        message: `You've spent $${totalSpending.toFixed(2)} this month. ${totalSpending > 2000 ? 'Consider reviewing your expenses to identify potential savings.' : 'Your spending appears to be under control.'}`,
        impact: totalSpending > 2000 ? 'medium' : 'low',
        actionable: true
      });
    }

    // Category analysis
    if (topCategories.length > 0) {
      const topCategory = topCategories[0];
      if (topCategory.percentage > 40) {
        insights.push({
          type: 'warning',
          title: 'High Category Concentration',
          message: `${topCategory.category} represents ${topCategory.percentage.toFixed(1)}% of your spending ($${topCategory.amount.toFixed(2)}). Consider diversifying your expenses or finding ways to reduce costs in this area.`,
          category: topCategory.category,
          impact: 'high',
          actionable: true
        });
      } else {
        insights.push({
          type: 'opportunity',
          title: 'Balanced Spending',
          message: `Your top category (${topCategory.category}) represents ${topCategory.percentage.toFixed(1)}% of spending. This shows good expense diversification.`,
          category: topCategory.category,
          impact: 'low',
          actionable: false
        });
      }
    }

    // Savings opportunity
    if (topCategories.length > 1) {
      const secondCategory = topCategories[1];
      insights.push({
        type: 'opportunity',
        title: 'Savings Opportunity',
        message: `By reducing ${secondCategory.category} expenses by 15%, you could save $${(secondCategory.amount * 0.15).toFixed(2)} monthly.`,
        category: secondCategory.category,
        impact: 'medium',
        actionable: true
      });
    }

    // Goal setting
    insights.push({
      type: 'goal',
      title: 'Set Financial Goals',
      message: 'Consider setting monthly budget goals for your top spending categories to better control your finances.',
      impact: 'medium',
      actionable: true
    });
  }

  return {
    insights,
    monthlyBudgetSuggestion: Math.max(totalSpending * 1.1, 500),
    topSpendingCategories: topCategories,
    savingsOpportunities: topCategories.slice(0, 3).map(cat => ({
      category: cat.category,
      potentialSavings: Math.round(cat.amount * 0.1),
      suggestion: `Reduce ${cat.category} spending by 10% to save $${Math.round(cat.amount * 0.1)} monthly.`
    })),
    financialScore: Math.min(85, Math.max(45, 100 - (topCategories.length > 0 ? (topCategories[0].percentage > 50 ? 25 : 10) : 0)))
  };
}

export async function analyzeSpendingPatterns(expenses: any[]): Promise<SpendingAnalysis> {
  // Calculate spending statistics first
  const totalSpending = expenses.filter(exp => exp.type === 'expense').reduce((sum, exp) => sum + exp.amount, 0);
  const categoryTotals = expenses
    .filter(exp => exp.type === 'expense')
    .reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  if (!isOpenAIConfigured()) {
    console.warn('OpenAI API key not configured, using enhanced fallback analysis');
    return createFallbackAnalysis(expenses, totalSpending, topCategories);
  }

  // Create context for OpenAI
  const expenseContext = `
User's spending data for analysis:
- Total monthly spending: $${totalSpending.toFixed(2)}
- Number of expense transactions: ${expenses.filter(exp => exp.type === 'expense').length}
- Number of income transactions: ${expenses.filter(exp => exp.type === 'income').length}
- Top spending categories: ${topCategories.map(cat => `${cat.category}: $${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}%)`).join(', ')}
- Recent transactions: ${expenses.slice(-10).map(exp => `${exp.type === 'income' ? '+' : '-'}$${exp.amount} on ${exp.category} - ${exp.description}`).join('; ')}

Please analyze this spending pattern and provide actionable financial insights.
`;

  try {
    const completion = await openai!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional financial advisor AI. Analyze user spending patterns and provide actionable, personalized financial advice. 

Return your response as a JSON object with this exact structure:
{
  "insights": [
    {
      "type": "tip|warning|opportunity|goal",
      "title": "Brief title (max 50 chars)",
      "message": "Detailed advice message (max 200 chars)",
      "category": "relevant spending category if applicable",
      "impact": "low|medium|high",
      "actionable": true|false
    }
  ],
  "monthlyBudgetSuggestion": number,
  "savingsOpportunities": [
    {
      "category": "category name",
      "potentialSavings": number,
      "suggestion": "specific actionable suggestion (max 150 chars)"
    }
  ],
  "financialScore": number (1-100)
}

Focus on:
- Practical, actionable advice
- Specific dollar amounts when possible
- Realistic budget suggestions based on current spending
- Positive reinforcement for good habits
- Clear next steps for improvement
- Keep messages concise and encouraging`
        },
        {
          role: "user",
          content: expenseContext
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(response) as SpendingAnalysis;
    
    // Add top categories to the response
    analysis.topSpendingCategories = topCategories;
    
    // Validate and sanitize the response
    if (!analysis.insights || !Array.isArray(analysis.insights)) {
      throw new Error('Invalid insights format');
    }
    
    if (typeof analysis.financialScore !== 'number' || analysis.financialScore < 1 || analysis.financialScore > 100) {
      analysis.financialScore = 75; // Default score
    }
    
    return analysis;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Check if it's a rate limit error and provide specific feedback
    if (error instanceof Error && error.message.includes('429')) {
      console.warn('OpenAI API rate limit exceeded, using enhanced fallback analysis');
    } else if (error instanceof Error && error.message.includes('quota')) {
      console.warn('OpenAI API quota exceeded, using enhanced fallback analysis');
    } else if (error instanceof Error && error.message.includes('401')) {
      console.warn('OpenAI API authentication failed, check your API key');
    }
    
    // Return enhanced fallback analysis
    return createFallbackAnalysis(expenses, totalSpending, topCategories);
  }
}

export async function generatePersonalizedTip(expenses: any[], userGoal?: string): Promise<string> {
  if (!isOpenAIConfigured()) {
    return generateFallbackTip(expenses, userGoal);
  }

  const recentExpenses = expenses.slice(-10);
  const totalRecent = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  if (recentExpenses.length === 0) {
    return "Start tracking your daily expenses to gain insights into your spending habits and identify opportunities to save money. Even small purchases add up over time!";
  }
  
  const context = `Recent transactions: ${recentExpenses.map(exp => `${exp.type === 'income' ? '+' : '-'}$${exp.amount} on ${exp.category} - ${exp.description}`).join(', ')}`;
  
  try {
    const completion = await openai!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful financial advisor. Provide a brief, actionable financial tip based on the user's recent spending. Keep it under 150 words, make it encouraging and specific. Focus on practical advice they can implement immediately."
        },
        {
          role: "user",
          content: `${context}${userGoal ? ` User goal: ${userGoal}` : ''}`
        }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const tip = completion.choices[0]?.message?.content;
    return tip || generateFallbackTip(expenses, userGoal);
  } catch (error) {
    console.error('OpenAI API Error for tip generation:', error);
    return generateFallbackTip(expenses, userGoal);
  }
}

function generateFallbackTip(expenses: any[], userGoal?: string): string {
  const recentExpenses = expenses.slice(-5);
  const totalRecent = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  if (recentExpenses.length === 0) {
    return "Start tracking your daily expenses to gain insights into your spending habits. Even tracking small purchases like coffee or snacks can reveal surprising patterns!";
  }
  
  const avgExpense = totalRecent / recentExpenses.length;
  const expenseCategories = recentExpenses.reduce((acc, exp) => {
    if (exp.type === 'expense') {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(expenseCategories).sort(([,a], [,b]) => b - a)[0]?.[0];
  
  const tips = [
    `Your recent average expense is $${avgExpense.toFixed(2)}. Try the 24-hour rule: wait a day before making non-essential purchases over $50.`,
    `You've been spending on ${topCategory || 'various categories'}. Consider setting a weekly budget for discretionary spending to stay on track.`,
    `Track your expenses for 30 days to identify patterns. You might be surprised where your money goes!`,
    `Try the envelope method: allocate cash for different spending categories each week.`,
    `Before buying something, ask yourself: "Do I need this, or do I just want it?" This simple question can save you hundreds monthly.`
  ];
  
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  if (userGoal) {
    return `${randomTip} Remember your goal: ${userGoal}. Every dollar saved brings you closer!`;
  }
  
  return randomTip;
}