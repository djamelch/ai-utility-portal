
import { supabase } from '@/integrations/supabase/client';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
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
    
    console.log('Calling promote-admin function at:', functionUrl);
    
    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ userId }),
      });
      
      // First get the raw text response
      const text = await response.text();
      let responseData;
      
      // Only try to parse as JSON if there's content
      if (text.trim()) {
        try {
          responseData = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse response as JSON:', text);
          return new Response(
            JSON.stringify({ 
              message: 'Invalid response format from server',
              rawResponse: text 
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } else {
        responseData = {};
      }
      
      console.log('Function response:', responseData);
      
      if (!response.ok) {
        return new Response(
          JSON.stringify({ 
            message: responseData?.message || 'Failed to promote to admin',
            details: responseData 
          }),
          { status: response.status, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          message: 'Successfully promoted to admin',
          profile: responseData?.profile || null
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({ 
          message: 'Error communicating with function', 
          error: String(fetchError) 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
