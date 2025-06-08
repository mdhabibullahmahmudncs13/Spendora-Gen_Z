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

export async function analyzeSpendingPatterns(expenses: any[]): Promise<SpendingAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  // Calculate spending statistics
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
    
    // Fallback analysis if OpenAI fails
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
        }
      ],
      monthlyBudgetSuggestion: Math.ceil(totalSpending * 1.1),
      topSpendingCategories: topCategories,
      savingsOpportunities: [],
      financialScore: 75
    };
  }
}

export async function generatePersonalizedTip(expenses: any[], userGoal?: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return "Connect your OpenAI API key to get personalized financial tips!";
  }

  const recentExpenses = expenses.slice(-5);
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

    return completion.choices[0]?.message?.content || "Keep tracking your expenses to build better financial habits!";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "Keep tracking your expenses to build better financial habits!";
  }
}