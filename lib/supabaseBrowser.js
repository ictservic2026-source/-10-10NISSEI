import { createClient } from '@supabase/supabase-js'
// URL และ Publishable Key เป็นค่าสาธารณะ (ออกแบบให้อยู่ในเบราว์เซอร์ได้) จึงมีค่าสำรองไว้กัน build ล้ม
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwmnomoiqserrniegnps.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_kTg0fo-rOOUTMHMDzJUBZQ_f0lltooW'
export const supabase = createClient(url, key)
