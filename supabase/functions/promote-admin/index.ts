
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    })
  }

  try {
    // Create a Supabase client with the service role key (has admin privileges)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the JWT from the request to verify the user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: 'Missing authorization header' }),
        { status: 401, headers: corsHeaders }
      )
    }

    // Verify the token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized', error: authError }),
        { status: 401, headers: corsHeaders }
      )
    }

    // Get the request body
    let userId
    try {
      const body = await req.json()
      userId = body.userId
    } catch (e) {
      return new Response(
        JSON.stringify({ message: 'Invalid request body' }),
        { status: 400, headers: corsHeaders }
      )
    }
    
    // Check that the user is promoting themselves (security measure)
    if (user.id !== userId) {
      return new Response(
        JSON.stringify({ message: 'You can only promote yourself to admin' }),
        { status: 403, headers: corsHeaders }
      )
    }

    // Update the profile role to admin using the admin client
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId)

    if (updateError) {
      console.error('Update error:', updateError)
      return new Response(
        JSON.stringify({ message: 'Failed to update profile', error: updateError }),
        { status: 500, headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Successfully promoted to admin' }),
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: String(error) }),
      { status: 500, headers: corsHeaders }
    )
  }
})
