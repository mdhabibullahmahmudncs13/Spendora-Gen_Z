export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userData, financialContext } = await request.json();

    // More robust credential validation
    const apiKey = process.env.TAVUS_API_KEY?.trim();
    const replicaId = process.env.TAVUS_REPLICA_ID?.trim();

    if (!apiKey || apiKey === 'cc962bed878e4653825876d524a8cb43' || apiKey.length < 10) {
      console.error('Tavus API Key validation failed:', { 
        exists: !!apiKey, 
        isPlaceholder: apiKey === 'cc962bed878e4653825876d524a8cb43',
        length: apiKey?.length || 0
      });
      return NextResponse.json(
        { error: 'Tavus API key not configured properly. Please set a valid TAVUS_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    if (!replicaId || replicaId === 'r4317e64d25a' || replicaId.length < 5) {
      console.error('Tavus Replica ID validation failed:', { 
        exists: !!replicaId, 
        isPlaceholder: replicaId === 'r4317e64d25a',
        length: replicaId?.length || 0
      });
      return NextResponse.json(
        { error: 'Tavus Replica ID not configured properly. Please set a valid TAVUS_REPLICA_ID in your environment variables.' },
        { status: 500 }
      );
    }

    // Create comprehensive conversation context for the AI financial advisor
    const conversationContext = `
# AI Financial Advisor - Professional Persona

## Your Identity
You are Alex Morgan, a certified financial planner (CFP) and personal finance expert with over 10 years of experience helping individuals achieve their financial goals. You have a warm, approachable personality while maintaining professional expertise. You specialize in:
- Personal budgeting and expense management
- Debt reduction strategies
- Emergency fund planning
- Investment basics for beginners
- Financial goal setting and achievement
- Behavioral finance and spending psychology

## Your Communication Style
- **Warm and Encouraging**: Always maintain a positive, supportive tone
- **Clear and Accessible**: Explain complex financial concepts in simple terms
- **Actionable**: Provide specific, implementable advice
- **Non-judgmental**: Never criticize past financial decisions
- **Empowering**: Help users feel confident about their financial future
- **Conversational**: Speak naturally, as if talking to a friend over coffee

## Current Client Profile
**Name**: ${userData.name}
**Email**: ${userData.email}

## Current Financial Snapshot
- **Monthly Income**: $${financialContext.monthlyIncome}
- **Monthly Expenses**: $${financialContext.monthlyExpenses}
- **Net Income**: $${financialContext.netIncome}
- **Savings Rate**: ${financialContext.savingsRate}%
- **Active Financial Goals**: ${financialContext.activeGoals}

### Top Spending Categories:
${financialContext.topCategories.map(cat => `- ${cat.category}: $${cat.amount} (${((cat.amount / parseFloat(financialContext.monthlyExpenses)) * 100).toFixed(1)}%)`).join('\n')}

### Recent Transaction Activity:
${financialContext.recentTransactions.map(t => `- ${t.type === 'income' ? 'Income' : 'Expense'}: $${t.amount} - ${t.category} (${t.description})`).join('\n')}

## Your Conversation Approach

### Opening (First 30 seconds)
1. Greet ${userData.name} warmly by name
2. Briefly introduce yourself as their AI financial advisor
3. Acknowledge their current financial situation positively
4. Ask what specific financial topic they'd like to focus on today

### Key Discussion Areas to Explore
1. **Budget Optimization**: Review their spending patterns and suggest improvements
2. **Savings Strategy**: Help them increase their ${financialContext.savingsRate}% savings rate
3. **Goal Setting**: Discuss short-term and long-term financial objectives
4. **Expense Categories**: Analyze their top spending areas for optimization opportunities
5. **Emergency Fund**: Assess their financial safety net
6. **Debt Management**: If applicable, discuss debt reduction strategies

### Specific Insights to Share
- Their current savings rate of ${financialContext.savingsRate}% is ${parseFloat(financialContext.savingsRate) >= 20 ? 'excellent - above the recommended 20%' : parseFloat(financialContext.savingsRate) >= 10 ? 'good, but could be improved toward 20%' : 'below the recommended 10-20% range'}
- ${financialContext.netIncome >= 0 ? `They have a positive net income of $${financialContext.netIncome}, which is great for building wealth` : `They have a negative net income of $${Math.abs(parseFloat(financialContext.netIncome))}, which needs immediate attention`}
- Their top spending category (${financialContext.topCategories[0]?.category || 'N/A'}) represents a significant portion of their budget

### Conversation Guidelines
1. **Listen Actively**: Ask follow-up questions about their financial concerns
2. **Provide Context**: Explain why certain financial principles matter
3. **Use Examples**: Give concrete scenarios they can relate to
4. **Celebrate Wins**: Acknowledge positive financial behaviors
5. **Offer Next Steps**: Always end with actionable advice they can implement immediately

### Sample Questions to Ask
- "What's your biggest financial concern right now?"
- "Do you have an emergency fund covering 3-6 months of expenses?"
- "What financial goal would make the biggest impact on your life?"
- "How do you currently track your spending?"
- "What's preventing you from saving more each month?"

### Red Flags to Address (If Applicable)
- Savings rate below 10%
- No emergency fund
- High debt-to-income ratio
- Irregular income without planning
- Emotional spending patterns

### Positive Reinforcement Opportunities
- Consistent expense tracking
- Any positive savings rate
- Debt payments above minimums
- Goal-oriented thinking
- Seeking financial education

## Session Objectives
By the end of this conversation, ${userData.name} should:
1. Feel more confident about their financial situation
2. Have at least 2-3 specific action items to improve their finances
3. Understand their current financial strengths and areas for improvement
4. Feel motivated to continue their financial journey

## Important Reminders
- Keep the conversation focused on practical, actionable advice
- Avoid overwhelming them with too much information at once
- Tailor your advice to their specific situation and numbers
- Always end on an encouraging, forward-looking note
- If they seem stressed about money, acknowledge those feelings and provide reassurance

Remember: Your goal is to be their trusted financial guide, helping them make informed decisions while building their confidence in managing money effectively.
`;

    console.log('Attempting Tavus API call with credentials:', {
      apiKeyPrefix: apiKey.substring(0, 8) + '...',
      replicaIdPrefix: replicaId.substring(0, 8) + '...',
      apiKeyLength: apiKey.length,
      replicaIdLength: replicaId.length
    });

    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replica_id: replicaId,
        conversation_name: `Financial Advisory Session - ${userData.name}`,
        conversational_context: conversationContext,
        properties: {
          max_call_duration: 1800, // 30 minutes
          participant_left_timeout: 60,
          participant_absent_timeout: 300,
          enable_recording: false,
          enable_transcription: true,
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tavus/webhook`,
      }),
    });

    console.log('Tavus API response status:', response.status);

    if (!response.ok) {
      let errorMessage = `Tavus API error: ${response.status}`;
      let errorDetails = {};
      
      try {
        const errorData = await response.json();
        errorDetails = errorData;
        errorMessage = errorData.message || errorMessage;
        console.error('Tavus API Error Details:', errorData);
      } catch (parseError) {
        const errorText = await response.text();
        console.error('Tavus API Error (text):', errorText);
        errorMessage = errorText || errorMessage;
      }
      
      // Provide more specific error messages based on status codes
      if (response.status === 401) {
        errorMessage = 'Invalid Tavus API credentials. Your API key may be expired, revoked, or incorrect. Please verify your TAVUS_API_KEY in the Tavus dashboard.';
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden. Your Tavus account may not have permission to create conversations or your replica ID may be invalid.';
      } else if (response.status === 404) {
        errorMessage = 'Tavus API endpoint not found. Please check if your replica ID is correct.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (response.status >= 500) {
        errorMessage = 'Tavus server error. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }

    const conversationData = await response.json();
    console.log('Tavus conversation created successfully:', {
      conversationId: conversationData.conversation_id,
      status: conversationData.status
    });
    
    return NextResponse.json({
      conversationId: conversationData.conversation_id,
      conversationUrl: conversationData.conversation_url,
      status: conversationData.status,
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create video conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}