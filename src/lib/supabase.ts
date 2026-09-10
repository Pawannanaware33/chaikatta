import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl! : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey! : 'placeholder-key'
);

/**
 * Verifies live connection to Supabase database by attempting a ping to products table.
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
  count?: number;
}> {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      message: 'Supabase credentials not set in .env. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect to your database.',
    };
  }

  try {
    const { data, error, count } = await supabase
      .from('products')
      .select('id, name', { count: 'exact' })
      .limit(1);

    if (error) {
      return {
        connected: false,
        message: `Database query error: ${error.message} (Code: ${error.code || 'N/A'})`,
      };
    }

    return {
      connected: true,
      message: 'Successfully connected to Supabase PostgreSQL database!',
      count: count ?? data?.length ?? 0,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network error';
    return {
      connected: false,
      message: `Connection check failed: ${message}`,
    };
  }
}
