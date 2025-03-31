
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
    
    console.log('Updating user profile directly in the database');
    
    // Instead of calling the edge function, update the profile directly
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', userId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating profile:', updateError);
      return res.status(500).json({ 
        message: 'Failed to promote to admin',
        error: updateError.message
      });
    }
    
    if (!updatedProfile) {
      // Profile doesn't exist yet, create it
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, role: 'admin' }])
        .select()
        .single();
        
      if (insertError) {
        console.error('Error creating profile:', insertError);
        return res.status(500).json({ 
          message: 'Failed to create admin profile',
          error: insertError.message
        });
      }
      
      return res.status(200).json({
        message: 'Successfully created admin profile',
        profile: newProfile
      });
    }
    
    return res.status(200).json({
      message: 'Successfully promoted to admin',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: String(error) 
    });
  }
}
