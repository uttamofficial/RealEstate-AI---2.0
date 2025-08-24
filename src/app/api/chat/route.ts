import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Check if AI is enabled
const isAIEnabled = () => {
  return !!process.env.OPENAI_API_KEY && process.env.AI_ENABLED !== 'disabled';
};

// Fetch top deals for context
async function getTopDeals() {
  try {
    // In a real implementation, this would be a direct database query
    // For now, we'll make an internal API call
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3002';
    
    const response = await fetch(`${baseUrl}/api/deals?sort=score`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch deals');
    }
    
    const data = await response.json();
    // Return top 30 deals to keep token count manageable
    return data.deals.slice(0, 30);
  } catch (error) {
    console.error('Error fetching deals for AI context:', error);
    // Return fallback empty array
    return [];
  }
}

// Create system prompt with deals context
function createSystemPrompt(deals: any[]) {
  const dealsJson = JSON.stringify(deals, null, 2);
  
  return `You are a real estate investment analyst assistant. You have access to the user's current property deals data and should use this information to provide insights.

CURRENT DEALS DATA:
${dealsJson}

INSTRUCTIONS:
- Use the provided deals JSON data as your primary source of information
- When giving metrics or recommendations, cite specific property titles and cities
- Prefer concise, bullet-point summaries for clarity
- Focus on investment metrics like cap rates, discount percentages, and risk levels
- Compare properties when relevant
- If asked about properties not in the data, clearly state you only have access to the current portfolio
- Always ground your responses in the actual data provided

RESPONSE STYLE:
- Use bullet points for key insights
- Include specific numbers and percentages
- Mention property titles and locations when relevant
- Keep responses practical and actionable for real estate investors`;
}

export async function POST(request: NextRequest) {
  try {
    // Check if AI is enabled
    if (!isAIEnabled()) {
      return NextResponse.json(
        { 
          error: 'AI assistant is disabled. Please configure OPENAI_API_KEY in your environment variables.',
          disabled: true 
        },
        { status: 503 }
      );
    }

    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Get current deals for context
    const deals = await getTopDeals();
    const systemPrompt = createSystemPrompt(deals);

    // Make OpenAI API call
    const completion = await openai!.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      response,
      dealsCount: deals.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error in chat API:', error);
    
    // Handle specific OpenAI errors
    if (error?.code === 'invalid_api_key') {
      return NextResponse.json(
        { 
          error: 'Invalid OpenAI API key. Please check your configuration.',
          disabled: true 
        },
        { status: 401 }
      );
    }

    if (error?.code === 'insufficient_quota') {
      return NextResponse.json(
        { 
          error: 'OpenAI API quota exceeded. Please check your billing.',
          disabled: true 
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    enabled: isAIEnabled(),
    provider: process.env.OPENAI_API_KEY ? 'openai' : 'none',
    status: isAIEnabled() ? 'ready' : 'disabled'
  });
}
