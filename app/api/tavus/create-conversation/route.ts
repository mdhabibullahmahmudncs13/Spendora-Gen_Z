export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// Language mapping for ISO codes to full names
const LANGUAGE_MAP: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ja: 'Japanese',
  zh: 'Chinese',
  ru: 'Russian',
};

export async function POST(request: NextRequest) {
  try {
    const { userData, financialContext } = await request.json();

    // Validate required environment variables
    const apiKey = process.env.TAVUS_API_KEY?.trim();
    const replicaId = process.env.TAVUS_REPLICA_ID?.trim();
    const personaId = process.env.TAVUS_PERSONA_ID?.trim();

    if (!apiKey || apiKey === '' || apiKey.length < 10 || !replicaId || !personaId) {
      console.error('Tavus API Key validation failed:', { 
        exists: !!apiKey, 
        isPlaceholder: apiKey === 'cc962bed878e4653825876d524a8cb43',
        length: apiKey?.length || 0
      });
      return NextResponse.json(
        { error: 'Tavus API key, Replica ID, or Persona ID not configured properly. Please set valid TAVUS_API_KEY, TAVUS_REPLICA_ID, and TAVUS_PERSONA_ID in your environment variables.' },
        { status: 500 }
      );
    }

    // Determine language (default to English if not specified)
    const userLanguage = userData.language || 'en';
    const fullLanguageName = LANGUAGE_MAP[userLanguage] || 'English';

    // Create comprehensive conversation context
    const conversationContext = `
# AI Financial Advisor - Alex Morgan

## Your Identity
You are Alex Morgan, a certified financial planner (CFP) and personal finance expert with over 10 years of experience helping individuals achieve their financial goals.

## Current Client: ${userData.name}
**Email**: ${userData.email}

## Financial Overview
- **Monthly Income**: $${financialContext.monthlyIncome}
- **Monthly Expenses**: $${financialContext.monthlyExpenses}
- **Net Income**: $${financialContext.netIncome}
- **Savings Rate**: ${financialContext.savingsRate}%
- **Active Goals**: ${financialContext.activeGoals}

### Top Spending Categories:
${financialContext.topCategories.map((cat: { category: string; amount: number }) => 
  `- ${cat.category}: $${cat.amount} (${((cat.amount / parseFloat(financialContext.monthlyExpenses || '1')) * 100).toFixed(1)}%)`
).join('\n')}

### Recent Transactions:
${financialContext.recentTransactions.map((t: { type: string; amount: number; category: string; description: string }) => 
  `- ${t.type === 'income' ? 'Income' : 'Expense'}: $${t.amount} - ${t.category} (${t.description})`
).join('\n')}

## Session Approach
1. Greet ${userData.name} warmly
2. Focus on their specific financial concerns
3. Provide actionable advice
4. End with clear next steps

### Key Insights:
- Savings rate: ${parseFloat(financialContext.savingsRate) >= 20 ? 'Excellent' : 'Could be improved'}
- Net income: ${parseFloat(financialContext.netIncome) >= 0 ? 'Positive' : 'Negative - needs attention'}
`;

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
        language: fullLanguageName, // Using full language name
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tavus/webhook`,
    };

    console.log('Creating Tavus conversation with:', {
      replicaId: replicaId,
      personaId: personaId,
      userName: userData.name,
      language: fullLanguageName
    });

    const response = await fetch('https://tavusapi.com/v2/conversations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Tavus API error: ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('Tavus API Error:', errorData);
      } catch {
        console.error('Tavus API Error:', errorText);
        errorMessage = errorText || errorMessage;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const conversationData = await response.json();
    
    return NextResponse.json({
      conversationId: conversationData.conversation_id,
      conversationUrl: conversationData.conversation_url,
      status: conversationData.status,
    });
    
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}