
import { supabase } from '@/lib/supabase-client';

export async function POST(req: Request) {
  try {
    // Check if the current user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return new Response(
        JSON.stringify({ message: 'Not authenticated' }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Get the user ID from the request
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ message: 'User ID is required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Check if any admin already exists
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
    
    if (countError) {
      console.error('Error checking admin count:', countError);
      return new Response(
        JSON.stringify({ message: 'Failed to check admin status' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // If an admin already exists, check if current user is admin
    if (count && count > 0) {
      // Check if the current user is an admin
      const { data: adminCheck } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (!adminCheck || adminCheck.role !== 'admin') {
        return new Response(
          JSON.stringify({ message: 'Unauthorized - must be an admin' }),
          { 
            status: 403,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }
    
    // Update the user's role to admin
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId);
    
    if (error) {
      console.error('Error promoting user:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to promote user to admin' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ message: 'Successfully promoted to admin' }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
