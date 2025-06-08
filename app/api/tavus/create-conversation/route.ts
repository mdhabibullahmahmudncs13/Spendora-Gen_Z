export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userData, financialContext } = await request.json();

    if (!process.env.TAVUS_API_KEY) {
      return NextResponse.json(
        { error: 'Tavus API key not configured' },
        { status: 500 }
      );
    }

    if (!process.env.TAVUS_REPLICA_ID) {
      return NextResponse.json(
        { error: 'Tavus Replica ID not configured' },
        { status: 500 }
      );
    }

    // Create conversation context for the AI advisor
    const conversationContext = `
You are a professional financial advisor AI speaking with ${userData.name}. 

Current Financial Overview:
- Monthly Income: $${financialContext.monthlyIncome}
- Monthly Expenses: $${financialContext.monthlyExpenses}
- Net Income: $${financialContext.netIncome}
- Savings Rate: ${financialContext.savingsRate}%
- Active Goals: ${financialContext.activeGoals}
- Top Spending Categories: ${financialContext.topCategories.map(cat => `${cat.category}: $${cat.amount}`).join(', ')}

Recent Transactions: ${financialContext.recentTransactions.map(t => `$${t.amount} on ${t.category} - ${t.description}`).join('; ')}

Provide personalized, actionable financial advice. Be conversational, encouraging, and focus on practical steps they can take to improve their financial health. Ask questions to understand their goals better and provide specific recommendations based on their spending patterns.
`;

    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TAVUS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replica_id: process.env.TAVUS_REPLICA_ID,
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Tavus API Error:', errorData);
      throw new Error(`Tavus API error: ${response.status}`);
    }

    const conversationData = await response.json();
    
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