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

    console.log('Received audio file:', {
      name: audioFile.name,
      size: audioFile.size,
      type: audioFile.type
    });

    // Check if we have a real API key configured
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
    const hasValidApiKey = apiKey && 
      apiKey !== 'your_elevenlabs_api_key_here' && 
      apiKey !== 'your_elevenlabs_api_key' && 
      apiKey.length > 10;

    if (hasValidApiKey) {
      try {
        // Try to use ElevenLabs API
        const elevenLabsFormData = new FormData();
        elevenLabsFormData.append('audio', audioFile);
        elevenLabsFormData.append('model_id', 'whisper-1');

        const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
          },
          body: elevenLabsFormData,
        });

        if (response.ok) {
          const transcriptionData = await response.json();
          return NextResponse.json({
            text: transcriptionData.text || '',
            confidence: transcriptionData.confidence || 0.9,
          });
        } else {
          console.warn('ElevenLabs API failed, falling back to simulation');
        }
      } catch (error) {
        console.warn('ElevenLabs API error, falling back to simulation:', error);
      }
    }

    // Fallback: Simulate transcription for demo purposes
    console.log('Using simulated transcription (ElevenLabs API not available)');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a simulated transcription based on common voice patterns
    const sampleTranscriptions = [
      "I spent $15 on lunch at McDonald's",
      "I earned $500 from freelance work",
      "Add $120 for gas on Monday",
      "Record $2000 salary payment",
      "I bought groceries for $85",
      "Coffee expense $4.50 at Starbucks",
      "I paid $50 for utilities",
      "Received $300 bonus from work",
      "Spent $25 on movie tickets",
      "Add $75 for dinner at restaurant"
    ];
    
    const randomTranscription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
    
    return NextResponse.json({
      text: randomTranscription,
      confidence: 0.85,
      simulated: true
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