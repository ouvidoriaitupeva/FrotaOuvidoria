import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
  ?.replace(/\/+$/, '')
  ?.replace(/\/rest\/v1$/i, '');
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigured = Boolean(
  url && anonKey && !url.includes('seu-projeto') && !anonKey.includes('sua-chave')
);

export const supabase = supabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;
