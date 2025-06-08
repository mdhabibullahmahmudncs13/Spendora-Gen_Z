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
        isPlaceholder: apiKey === 'your_actual_tavus_api_key_here',
        length: apiKey?.length || 0
      });
      return NextResponse.json(
        { error: 'Tavus API key not configured properly. Please set a valid TAVUS_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    if (!replicaId || replicaId === 'your_actual_tavus_replica_id_here' || replicaId.length < 5) {
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