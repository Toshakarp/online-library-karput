import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/config/env.config.js';

export const supabase: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);