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

    const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
    
    if (!apiKey || apiKey === 'your_elevenlabs_api_key_here' || apiKey.length < 10) {
      console.error('ElevenLabs API Key validation failed:', { 
        exists: !!apiKey, 
        isPlaceholder: apiKey === 'your_elevenlabs_api_key_here',
        length: apiKey?.length || 0
      });
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured properly. Please set a valid ELEVENLABS_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    // Convert audio file to buffer
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type });

    // Create form data for ElevenLabs API
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append('audio', audioBlob, audioFile.name);
    elevenLabsFormData.append('model_id', 'whisper-1');

    console.log('Sending audio to ElevenLabs for transcription:', {
      audioSize: audioBuffer.byteLength,
      audioType: audioFile.type,
      apiKeyPrefix: apiKey.substring(0, 8) + '...'
    });

    const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: elevenLabsFormData,
    });

    console.log('ElevenLabs API response status:', response.status);

    if (!response.ok) {
      let errorMessage = `ElevenLabs API error: ${response.status}`;
      let errorDetails = {};
      
      try {
        const errorData = await response.json();
        errorDetails = errorData;
        errorMessage = errorData.detail?.message || errorData.message || errorData.error || errorMessage;
        console.error('ElevenLabs API Error Details:', errorData);
      } catch (parseError) {
        const responseText = await response.text();
        console.error('ElevenLabs API Error (text):', responseText);
        errorMessage = responseText || errorMessage;
      }
      
      if (response.status === 401) {
        errorMessage = 'Invalid ElevenLabs API credentials. Please verify your API key is correct and active.';
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden. Your ElevenLabs account may not have permission to use speech-to-text.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
      } else if (response.status >= 500) {
        errorMessage = 'ElevenLabs server error. Please try again later.';
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to transcribe audio',
          details: errorMessage
        },
        { status: response.status }
      );
    }

    const transcriptionData = await response.json();
    console.log('ElevenLabs transcription successful:', {
      hasText: !!transcriptionData.text,
      textLength: transcriptionData.text?.length || 0
    });
    
    return NextResponse.json({
      text: transcriptionData.text || '',
      confidence: transcriptionData.confidence || 0.9,
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