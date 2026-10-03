import { NextResponse } from 'next/server'
import { db } from '../../../lib/server'
const KNOWN = ['SOLD_OUT', 'ALREADY_ORDERED', 'INVALID_CODE']
export async function POST(req) {
  const open = process.env.NEXT_PUBLIC_OPEN_AT
  if (open && Date.now() < new Date(open).getTime())
    return NextResponse.json({ error: 'NOT_OPEN' }, { status: 403 })
  const b = await req.json().catch(() => ({}))
  const name = String(b.name || '').trim().slice(0, 100)
  const dept = String(b.dept || '').trim().slice(0, 100)
  const code = String(b.code || '').trim()
  const size = String(b.size || '').trim().toUpperCase()
  if (!name || !dept || !/^[A-Za-z0-9]{6}$/.test(code) || !['SS','S','M','L','XL'].includes(size))
    return NextResponse.json({ error: 'INVALID_CODE' }, { status: 400 })
  const { data, error } = await db().rpc('buy_shirt', { p_name: name, p_code: code, p_dept: dept, p_size: size })
  if (error) {
    const k = KNOWN.find((x) => (error.message || '').includes(x))
    return NextResponse.json({ error: k || 'ERROR' }, { status: k ? 409 : 500 })
  }
  return NextResponse.json({ id: data })
}
