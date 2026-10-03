import { NextResponse } from 'next/server'
import { db, isAdmin } from '../../../../lib/server'
export const dynamic = 'force-dynamic'
export async function GET(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  const c = db()
  const [o, s] = await Promise.all([
    c.from('orders').select('*').order('created_at', { ascending: false }).limit(1000),
    c.from('stock').select('*'),
  ])
  return NextResponse.json({ orders: o.data || [], stock: s.data || [] })
}
export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  const { id } = await req.json().catch(() => ({}))
  const { error } = await db().rpc('cancel_order', { p_id: id })
  return error ? NextResponse.json({ error: 'ERROR' }, { status: 400 }) : NextResponse.json({ ok: true })
}
