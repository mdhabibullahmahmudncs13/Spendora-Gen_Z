export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { analyzeSpendingPatterns } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { expenses } = await request.json();

    if (!expenses || !Array.isArray(expenses)) {
      return NextResponse.json(
        { error: 'Invalid expenses data' },
        { status: 400 }
      );
    }

    const analysis = await analyzeSpendingPatterns(expenses);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze spending patterns',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}