import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedTip } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { expenses, userGoal } = await request.json();

    if (!expenses || !Array.isArray(expenses)) {
      return NextResponse.json(
        { error: 'Invalid expenses data' },
        { status: 400 }
      );
    }

    const tip = await generatePersonalizedTip(expenses, userGoal);
    
    return NextResponse.json({ tip });
  } catch (error) {
    console.error('Tip generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate financial tip',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}