import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  return {
    insights: [
      {
        type: 'tip',
        title: 'Track Your Progress',
        message: `You've spent $${totalSpending.toFixed(2)} this month. Consider setting a monthly budget to better manage your finances.`,
        impact: 'medium',
        actionable: true
      },
      {
        type: 'opportunity',
        title: 'Category Analysis',
        message: topCategories.length > 0 
          ? `Your top spending category is ${topCategories[0].category} at $${topCategories[0].amount.toFixed(2)}. Look for ways to optimize this area.`
          : 'Start tracking more expenses to get personalized insights.',
        impact: 'medium',
        actionable: true
      },
      {
        type: 'goal',
        title: 'Build Better Habits',
        message: 'Continue tracking your expenses regularly to identify patterns and opportunities for improvement.',
        impact: 'high',
        actionable: true
      }
    ],
    monthlyBudgetSuggestion: Math.ceil(totalSpending * 1.1),
    topSpendingCategories: topCategories,
    savingsOpportunities: topCategories.slice(0, 2).map(cat => ({
      category: cat.category,
      potentialSavings: Math.round(cat.amount * 0.1),
      suggestion: `Consider reducing ${cat.category} expenses by 10% to save $${Math.round(cat.amount * 0.1)} monthly.`
    })),
    financialScore: Math.min(85, Math.max(45, 100 - (topCategories.length > 0 ? (topCategories[0].percentage > 50 ? 20 : 10) : 0)))
  };
}

export async function analyzeSpendingPatterns(expenses: any[]): Promise<SpendingAnalysis> {
  // Calculate spending statistics first
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalSpending) * 100
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, using fallback analysis');
    return createFallbackAnalysis(expenses, totalSpending, topCategories);
  }

  // Create context for OpenAI
  const expenseContext = `
User's spending data for analysis:
- Total monthly spending: $${totalSpending.toFixed(2)}
- Number of transactions: ${expenses.length}
- Top spending categories: ${topCategories.map(cat => `${cat.category}: $${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}%)`).join(', ')}
- Recent expenses: ${expenses.slice(-10).map(exp => `$${exp.amount} on ${exp.category} - ${exp.description}`).join('; ')}

Please analyze this spending pattern and provide:
1. 3-4 personalized financial insights
2. Budget recommendations
3. Specific savings opportunities
4. A financial health score (1-100)
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a professional financial advisor AI. Analyze user spending patterns and provide actionable, personalized financial advice. 

Return your response as a JSON object with this exact structure:
{
  "insights": [
    {
      "type": "tip|warning|opportunity|goal",
      "title": "Brief title",
      "message": "Detailed advice message",
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
      "suggestion": "specific actionable suggestion"
    }
  ],
  "financialScore": number (1-100)
}

Focus on:
- Practical, actionable advice
- Specific dollar amounts when possible
- Realistic budget suggestions
- Positive reinforcement for good habits
- Clear next steps for improvement`
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
    
    return analysis;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Check if it's a rate limit error and provide specific feedback
    if (error instanceof Error && error.message.includes('429')) {
      console.warn('OpenAI API rate limit exceeded, using enhanced fallback analysis');
    } else if (error instanceof Error && error.message.includes('quota')) {
      console.warn('OpenAI API quota exceeded, using enhanced fallback analysis');
    }
    
    // Return enhanced fallback analysis
    return createFallbackAnalysis(expenses, totalSpending, topCategories);
  }
}

export async function generatePersonalizedTip(expenses: any[], userGoal?: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return "Connect your OpenAI API key to get personalized financial tips! In the meantime, keep tracking your expenses to build better financial habits.";
  }

  const recentExpenses = expenses.slice(-5);
  const totalRecent = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Create a fallback tip based on recent spending patterns
  const fallbackTip = () => {
    if (recentExpenses.length === 0) {
      return "Start tracking your daily expenses to gain insights into your spending habits and identify opportunities to save money.";
    }
    
    const avgExpense = totalRecent / recentExpenses.length;
    const topCategory = recentExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const mainCategory = Object.entries(topCategory).sort(([,a], [,b]) => b - a)[0]?.[0];
    
    if (avgExpense > 50) {
      return `Your recent average expense is $${avgExpense.toFixed(2)}. Consider setting daily spending limits to help control larger purchases, especially in ${mainCategory || 'your main spending categories'}.`;
    } else {
      return `Great job keeping your recent expenses moderate! Your average is $${avgExpense.toFixed(2)}. ${userGoal ? `To reach your goal of ${userGoal}, ` : ''}consider setting aside any extra money into savings.`;
    }
  };
  
  const context = `Recent expenses: ${recentExpenses.map(exp => `$${exp.amount} on ${exp.category}`).join(', ')}`;
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful financial advisor. Provide a brief, actionable financial tip based on the user's recent spending. Keep it under 100 words and make it encouraging."
        },
        {
          role: "user",
          content: `${context}${userGoal ? ` User goal: ${userGoal}` : ''}`
        }
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || fallbackTip();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Check if it's a rate limit or quota error
    if (error instanceof Error && (error.message.includes('429') || error.message.includes('quota'))) {
      console.warn('OpenAI API limit exceeded, using smart fallback tip');
    }
    
    return fallbackTip();
  }
}