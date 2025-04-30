
import { createClient } from "@supabase/supabase-js"

/**
 * Supabase **service role** client — bypasses RLS.  
 * Use **ONLY** in trusted server‑side code (e.g. Server Actions, Route Handlers).
 */
export const supabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  if (!url || !key) throw new Error("Missing Supabase env vars")
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
