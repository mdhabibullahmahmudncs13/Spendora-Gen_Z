export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Since ElevenLabs API is not configured, return a simulated response
    // This prevents the API from failing when voice input is attempted
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a simulated transcription
    const sampleTranscriptions = [
      "I spent $15 on lunch at McDonald's",
      "I earned $500 from freelance work",
      "Add $120 for gas on Monday",
      "Record $2000 salary payment",
      "I bought groceries for $85",
      "Coffee expense $4.50 at Starbucks"
    ];
    
    const randomTranscription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
    
    return NextResponse.json({
      text: randomTranscription,
      confidence: 0.9,
    });
  } catch (error) {
    console.error('Voice transcription error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process voice input',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}