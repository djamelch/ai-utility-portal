
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    
    // Get the environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    // Get the session from the cookie
    const response = await fetch(`${supabaseUrl}/functions/v1/promote-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization') || ''
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || 'Failed to promote to admin' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(
      { message: 'Successfully promoted to admin' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
