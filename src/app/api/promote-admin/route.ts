
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Check if the current user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get the user ID from the request
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if any admin already exists
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
    
    if (countError) {
      console.error('Error checking admin count:', countError);
      return NextResponse.json(
        { message: 'Failed to check admin status' },
        { status: 500 }
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
        return NextResponse.json(
          { message: 'Unauthorized - must be an admin' },
          { status: 403 }
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
      return NextResponse.json(
        { message: 'Failed to promote user to admin' },
        { status: 500 }
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
