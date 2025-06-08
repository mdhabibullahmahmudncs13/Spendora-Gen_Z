export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userData, financialContext } = await request.json();

    // Use your specific Tavus credentials
    const apiKey = process.env.TAVUS_API_KEY?.trim();
    const replicaId = 'r4317e64d25a'; // Your specific Replica ID
    const personaId = 'p42a7aa830cc'; // Your specific Persona ID

    if (!apiKey || apiKey === 'your_actual_tavus_api_key_here' || apiKey.length < 10) {
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

    // Create comprehensive conversation context for your Financial Advisor persona
    const conversationContext = `
# AI Financial Advisor - Alex Morgan

## Your Identity
You are Alex Morgan, a certified financial planner (CFP) and personal finance expert with over 10 years of experience helping individuals achieve their financial goals. You have a warm, approachable personality while maintaining professional expertise.

## Your Specializations
- Personal budgeting and expense management
- Debt reduction strategies
- Emergency fund planning
- Investment basics for beginners
- Financial goal setting and achievement
- Behavioral finance and spending psychology

## Communication Style
- **Warm and Encouraging**: Always maintain a positive, supportive tone
- **Clear and Accessible**: Explain complex financial concepts in simple terms
- **Actionable**: Provide specific, implementable advice
- **Non-judgmental**: Never criticize past financial decisions
- **Empowering**: Help users feel confident about their financial future
- **Conversational**: Speak naturally, as if talking to a trusted friend

## Current Client: ${userData.name}
**Email**: ${userData.email}

## Financial Overview
- **Monthly Income**: $${financialContext.monthlyIncome}
- **Monthly Expenses**: $${financialContext.monthlyExpenses}
- **Net Income**: $${financialContext.netIncome}
- **Savings Rate**: ${financialContext.savingsRate}%
- **Active Goals**: ${financialContext.activeGoals}

### Top Spending Categories:
${financialContext.topCategories.map(cat => `- ${cat.category}: $${cat.amount} (${((cat.amount / parseFloat(financialContext.monthlyExpenses || '1')) * 100).toFixed(1)}%)`).join('\n')}

### Recent Transactions:
${financialContext.recentTransactions.map(t => `- ${t.type === 'income' ? 'Income' : 'Expense'}: $${t.amount} - ${t.category} (${t.description})`).join('\n')}

## Session Approach

### Opening (First 30 seconds)
1. Greet ${userData.name} warmly by name
2. Introduce yourself as Alex, their AI financial advisor
3. Acknowledge their financial situation positively
4. Ask what specific financial topic they'd like to focus on

### Key Areas to Explore
1. **Budget Optimization**: Review spending patterns and suggest improvements
2. **Savings Strategy**: Help increase their ${financialContext.savingsRate}% savings rate
3. **Goal Setting**: Discuss financial objectives and timelines
4. **Expense Analysis**: Optimize their top spending categories
5. **Emergency Fund**: Assess financial safety net
6. **Debt Strategy**: If applicable, discuss reduction plans

### Personalized Insights
- Savings rate of ${financialContext.savingsRate}% is ${parseFloat(financialContext.savingsRate) >= 20 ? 'excellent - above recommended 20%' : parseFloat(financialContext.savingsRate) >= 10 ? 'good, aim for 20%' : 'below recommended 10-20% range'}
- ${parseFloat(financialContext.netIncome) >= 0 ? `Positive net income of $${financialContext.netIncome} - great for wealth building` : `Negative net income of $${Math.abs(parseFloat(financialContext.netIncome))} needs immediate attention`}
- Top spending: ${financialContext.topCategories[0]?.category || 'Various categories'}

### Conversation Guidelines
1. **Listen Actively**: Ask follow-up questions about concerns
2. **Provide Context**: Explain why financial principles matter
3. **Use Examples**: Give relatable scenarios
4. **Celebrate Wins**: Acknowledge positive behaviors
5. **Offer Next Steps**: End with actionable advice

### Key Questions to Ask
- "What's your biggest financial concern right now?"
- "Do you have 3-6 months of expenses saved for emergencies?"
- "What financial goal would make the biggest impact on your life?"
- "How do you currently track your spending?"
- "What's preventing you from saving more each month?"

### Session Goals
By the end, ${userData.name} should:
1. Feel more confident about their finances
2. Have 2-3 specific action items
3. Understand their strengths and improvement areas
4. Feel motivated to continue their financial journey

## Important Notes
- Keep advice practical and actionable
- Don't overwhelm with too much information
- Tailor advice to their specific numbers
- End on an encouraging, forward-looking note
- If they're stressed about money, acknowledge and reassure

Your mission: Be their trusted financial guide, helping them make informed decisions while building confidence in money management.
`;

    console.log('Creating Tavus conversation with your credentials:', {
      replicaId: replicaId,
      personaId: personaId,
      apiKeyPrefix: apiKey.substring(0, 8) + '...',
      userName: userData.name
    });

    // Use the exact format from your example
    const requestBody = {
      replica_id: replicaId,
      persona_id: personaId,
      conversation_name: `Financial Advisory Session - ${userData.name}`,
      conversational_context: conversationContext,
      properties: {
        max_call_duration: 1800, // 30 minutes
        participant_left_timeout: 60,
        participant_absent_timeout: 300,
        enable_recording: false,
        enable_transcription: true,
        language: "en"
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tavus/webhook`,
    };

    console.log('Tavus API request body:', JSON.stringify(requestBody, null, 2));

    // Use the exact headers format from your example
    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey, // Use x-api-key as shown in your example
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Tavus API response status:', response.status);
    console.log('Tavus API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = `Tavus API error: ${response.status}`;
      let errorDetails = {};
      
      // Read the response body once as text
      const responseText = await response.text();
      
      try {
        // Try to parse the text as JSON
        const errorData = JSON.parse(responseText);
        errorDetails = errorData;
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('Tavus API Error Details:', errorData);
      } catch (parseError) {
        // If JSON parsing fails, use the raw text
        console.error('Tavus API Error (text):', responseText);
        errorMessage = responseText || errorMessage;
      }
      
      // Provide specific error messages based on status codes
      if (response.status === 401) {
        errorMessage = 'Invalid Tavus API credentials. Please verify your API key is correct and active in the Tavus dashboard.';
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden. Your Tavus account may not have permission to use this replica or persona.';
      } else if (response.status === 404) {
        errorMessage = `Replica ID (${replicaId}) or Persona ID (${personaId}) not found. Please verify these IDs in your Tavus dashboard.`;
      } else if (response.status === 422) {
        errorMessage = 'Invalid request parameters. Please check your replica and persona configuration.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (response.status >= 500) {
        errorMessage = 'Tavus server error. Please try again later.';
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to create video conversation',
          details: errorMessage
        },
        { status: response.status }
      );
    }

    const conversationData = await response.json();
    console.log('Tavus conversation created successfully:', {
      conversationId: conversationData.conversation_id,
      status: conversationData.status,
      url: conversationData.conversation_url ? 'URL provided' : 'No URL'
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