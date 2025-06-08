export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();
    
    // Log the webhook event for debugging
    console.log('Tavus Webhook Event:', webhookData);
    
    // Handle different webhook events
    switch (webhookData.event_type) {
      case 'conversation_started':
        console.log(`Conversation ${webhookData.conversation_id} started`);
        break;
      case 'conversation_ended':
        console.log(`Conversation ${webhookData.conversation_id} ended`);
        break;
      case 'participant_joined':
        console.log(`Participant joined conversation ${webhookData.conversation_id}`);
        break;
      case 'participant_left':
        console.log(`Participant left conversation ${webhookData.conversation_id}`);
        break;
      default:
        console.log(`Unknown webhook event: ${webhookData.event_type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}