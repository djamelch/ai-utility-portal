
import { supabase } from '@/integrations/supabase/client';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    // Get the user's session to pass along the JWT
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized - no session' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Call the Supabase Edge Function with the authorization token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const functionUrl = `${supabaseUrl}/functions/v1/promote-admin`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({ message: errorData.message || 'Failed to promote to admin' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    
    return new Response(
      JSON.stringify({ message: 'Successfully promoted to admin' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
