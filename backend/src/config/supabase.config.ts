import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.config';

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