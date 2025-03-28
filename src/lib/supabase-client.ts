
"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';

// This is the standardized Supabase client for client-side components
export const supabase = createClientComponentClient<Database>({
  supabaseUrl: "https://yilhwiqwoolmvmaasdra.supabase.co", 
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpbGh3aXF3b29sbXZtYWFzZHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1Njg5MjUsImV4cCI6MjA1ODE0NDkyNX0.sHZ-68hI6IJf73VwuErDhN6VGcr2R5DpyZkeamODfDk"
});
