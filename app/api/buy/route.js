import { NextResponse } from 'next/server'
import { db } from '../../../lib/server'

const SIZES = ['SS', 'S', 'M', 'L', 'XL']
const MAX_UNITS = 200

// Atomic compare-and-swap on stock.remaining so concurrent buyers can never oversell.
async function adjustStock(c, size, delta) {
  for (let i = 0; i < 8; i++) {
    const { data: row } = await c.from('stock').select('remaining,price').eq('size', size).single()
    if (!row) return { ok: false }
    const next = row.remaining + delta
    if (next < 0) return { ok: false, left: row.remaining }
    const { data } = await c.from('stock').update({ remaining: next }).eq('size', size).eq('remaining', row.remaining).select('size')
    if (data?.length) return { ok: true, price: Number(row.price) }
  }
  return { ok: false }
}

const fail = (error, status, extra) => NextResponse.json({ error, ...extra }, { status })

export async function POST(req) {
  const open = process.env.NEXT_PUBLIC_OPEN_AT
  if (open && Date.now() < new Date(open).getTime()) return fail('NOT_OPEN', 403)

  const b = await req.json().catch(() => ({}))
  const name = String(b.name || '').trim().slice(0, 100)
  const dept = String(b.dept || '').trim().slice(0, 100)
  const code = String(b.code || '').trim().toUpperCase()
  if (!name || !dept || !/^[A-Z0-9]{6}$/.test(code)) return fail('INVALID_CODE', 400)

  const qty = {}
  for (const it of Array.isArray(b.items) ? b.items : []) {
    const size = String(it?.size || '').toUpperCase()
    const q = Number(it?.qty)
    if (!SIZES.includes(size) || !Number.isInteger(q) || q < 1) return fail('INVALID_ITEMS', 400)
    qty[size] = (qty[size] || 0) + q
  }
  const sizes = Object.keys(qty)
  const units = sizes.reduce((a, k) => a + qty[k], 0)
  if (!units || units > MAX_UNITS) return fail('INVALID_ITEMS', 400)

  const c = db()
  const taken = []
  const rollback = () => Promise.all(taken.map((t) => adjustStock(c, t.size, t.qty)))

  for (const size of sizes) {
    const r = await adjustStock(c, size, -qty[size])
    if (!r.ok) {
      await rollback()
      return fail('SOLD_OUT', 409, { size, left: r.left ?? 0 })
    }
    taken.push({ size, qty: qty[size], price: r.price })
  }

  const rows = taken.flatMap((t) =>
    Array.from({ length: t.qty }, () => ({ emp_name: name, emp_code: code, dept, size: t.size, price: t.price, status: 'ok' })),
  )
  const { data, error } = await c.from('orders').insert(rows).select('id')
  if (error) {
    await rollback()
    console.error('[buy] insert failed', error.code, error.message)
    return fail(error.code === '23505' ? 'DUPLICATE_BLOCKED' : 'ERROR', error.code === '23505' ? 409 : 500)
  }

  const total = taken.reduce((a, t) => a + t.price * t.qty, 0)
  return NextResponse.json({ ids: data.map((d) => d.id), total })
}
