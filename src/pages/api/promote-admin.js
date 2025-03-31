
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Get the user's session to pass along the JWT
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized - no session' });
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
      
      // Make sure we handle the response properly
      let responseData;
      
      try {
        // First attempt to get response as JSON
        responseData = await response.json();
      } catch (e) {
        // If JSON parsing fails, get as text
        const text = await response.text();
        console.error('Failed to parse response as JSON:', text);
        
        // Return a proper error response
        return res.status(500).json({ 
          message: 'Invalid response format from function',
          details: text || 'Empty response' 
        });
      }
      
      console.log('Function response:', responseData);
      
      if (!response.ok) {
        return res.status(response.status).json({ 
          message: responseData?.message || 'Failed to promote to admin',
          details: responseData 
        });
      }
      
      return res.status(200).json({ 
        message: 'Successfully promoted to admin',
        profile: responseData?.profile || null
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({ 
        message: 'Error communicating with function', 
        error: String(fetchError) 
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: String(error) 
    });
  }
}
