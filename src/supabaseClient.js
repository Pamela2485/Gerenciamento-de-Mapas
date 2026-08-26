import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hqfzwsgbwrqjdomhxfhs.supabase.co'

const supabaseAnonKey = 'sb_publishable_gMfsv7c7frExTxQRmAFKtA_cHM9NVFr'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)