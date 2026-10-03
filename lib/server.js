import { createClient } from '@supabase/supabase-js'
export const db = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwmnomoiqserrniegnps.supabase.co', process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
export const isAdmin = (req) =>
  !!process.env.ADMIN_PASSWORD && req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD
