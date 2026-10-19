'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseBrowser'
import SiteHeader from '../components/site-header'
import Hero from '../components/hero'
import SizePicker from '../components/size-picker'
import { EmployeeForm, OrderSummary, MobileBuyBar } from '../components/checkout'
import SuccessModal from '../components/success-modal'

const SIZES = ['SS', 'S', 'M', 'L', 'XL']
const ERR = { SOLD_OUT: 'ไซส์นี้หมดแล้ว ลองไซส์อื่น', ALREADY_ORDERED: 'รหัสพนักงานนี้สั่งซื้อไปแล้ว', INVALID_CODE: 'รหัสพนักงานต้องมี 6 ตัว', NOT_OPEN: 'ยังไม่ถึงเวลาเปิดขาย' }
const OPEN = process.env.NEXT_PUBLIC_OPEN_AT ? new Date(process.env.NEXT_PUBLIC_OPEN_AT).getTime() : 0

export default function Shop() {
  const [stock, setStock] = useState({})
  const [sel, setSel] = useState(null)
  const [f, setF] = useState({ name: '', code: '', dept: '' })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [flash, setFlash] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('stock').select('size,total,remaining,price')
      if (data) setStock(Object.fromEntries(data.map((r) => [r.size, r])))
    }
    load()
    const ch = supabase.channel('stock-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock' }, (p) => {
        const r = p.new
        setStock((s) => ({ ...s, [r.size]: { ...s[r.size], ...r } }))
        setFlash(r.size); setTimeout(() => setFlash(null), 700)
      }).subscribe()
    const a = setInterval(load, 10000), b = setInterval(() => setNow(Date.now()), 1000)
    return () => { supabase.removeChannel(ch); clearInterval(a); clearInterval(b) }
  }, [])

  useEffect(() => { if (sel && (stock[sel]?.remaining ?? 1) < 1) setSel(null) }, [stock, sel])

  const open = now >= OPEN
  const seconds = Math.max(0, Math.ceil((OPEN - now) / 1000))
  const total = SIZES.reduce((a, k) => a + (stock[k]?.total || 0), 0)
  const left = SIZES.reduce((a, k) => a + (stock[k]?.remaining || 0), 0)
  const basePrice = SIZES.map((k) => stock[k]?.price).find((p) => p > 0) || 250
  const price = (sel && stock[sel]?.price) || basePrice
  const canBuy = open && sel && !busy

  async function buy() {
    setMsg('')
    if (!f.name.trim() || !f.dept.trim()) return setMsg('กรอกชื่อและแผนกให้ครบ')
    if (!/^[A-Za-z0-9]{6}$/.test(f.code.trim())) return setMsg('รหัสพนักงานต้องมี 6 ตัว')
    setBusy(true)
    const r = await fetch('/api/buy', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...f, size: sel }) })
    const j = await r.json().catch(() => ({}))
    setBusy(false)
    if (!r.ok) return setMsg(ERR[j.error] || 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง')
    setDone({ id: j.id, ...f, size: sel }); setSel(null)
  }
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  return (
    <div className="wrap">
      <SiteHeader open={open} />
      <main>
        <Hero open={open} seconds={seconds} total={total} left={left} price={basePrice} />
        <div className="checkout">
          <div className="checkout-main">
            <SizePicker sizes={SIZES} stock={stock} selected={sel} onSelect={setSel} open={open} flash={flash} />
            <EmployeeForm form={f} onChange={set} />
          </div>
          <OrderSummary size={sel} price={price} canBuy={canBuy} busy={busy} onBuy={buy} msg={msg} />
        </div>
      </main>
      <footer className="site-footer">NISSEI 40th Anniversary · จัดทำโดย แผนกสำนักประธาน</footer>
      <MobileBuyBar size={sel} price={price} canBuy={canBuy} busy={busy} onBuy={buy} msg={msg} />
      {done && <SuccessModal order={done} onClose={() => setDone(null)} />}
    </div>
  )
}
