// Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://uxwhjkqwycwrhmeeppiy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4d2hqa3F3eWN3cmhtZWVwcGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0OTY2MjMsImV4cCI6MjA3NTA3MjYyM30.XLulMPJUGDYjZaeufoEUVpqAmf8NJ8Vp7xitF6yGyMA';

// Debug logging
console.log('Supabase Config:', {
  url: SUPABASE_URL,
  keyExists: !!SUPABASE_PUBLISHABLE_KEY,
  keyLength: SUPABASE_PUBLISHABLE_KEY?.length
});

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing Supabase configuration!');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better security without email confirmation
  }
});