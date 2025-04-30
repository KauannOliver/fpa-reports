// lib/supabaseServer.ts
import { cookies, headers } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabaseServer = () => {
  const cookieStore  = cookies()
  const headerStore  = headers()
  return createServerComponentClient({
    cookies: () => cookieStore,
    headers: () => headerStore,
  })
}
