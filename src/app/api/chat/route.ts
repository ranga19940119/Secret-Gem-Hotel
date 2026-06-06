import { NextResponse } from 'next/server';

// In a real application, you would connect this to an LLM like Gemini or OpenAI.
// For now, we will simulate a smart response.
export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // Simple simulated AI logic
    let reply = "Thank you for your message. Our staff will get back to you shortly.";
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('lock') || lowerMessage.includes('tuya') || lowerMessage.includes('fingerprint') || lowerMessage.includes('card')) {
      reply = "Our rooms feature state-of-the-art Tuya Smart Fingerprint and Card locks. When you arrive, we will issue you a secure card. You don't need a card to check-out, simply leave the room and the system manages the rest securely.";
    } else if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('price')) {
      reply = "You can book a room directly on our 'Rooms' page. We offer Standard Double rooms starting at $150, Deluxe Suites at $280, and our Presidential Gem at $500 per night.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      reply = "Welcome to Secret Gem Hotel! How can I assist you with your stay today?";
    }

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
