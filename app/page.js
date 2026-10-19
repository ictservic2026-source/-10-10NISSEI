'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseBrowser'
import SiteHeader from '../components/site-header'
import Hero from '../components/hero'
import SizePicker from '../components/size-picker'
import { EmployeeForm, CartSidebar, ReviewItems, TotalCard, MobileBar } from '../components/checkout'
import SuccessModal from '../components/success-modal'

const SIZES = ['SS', 'S', 'M', 'L', 'XL']
const ERR = {
  INVALID_CODE: 'รหัสพนักงานต้องมี 6 ตัว และกรอกข้อมูลให้ครบ',
  INVALID_ITEMS: 'รายการสินค้าไม่ถูกต้อง',
  NOT_OPEN: 'ยังไม่ถึงเวลาเปิดขาย',
  DUPLICATE_BLOCKED: 'ระบบยังจำกัด 1 รหัสต่อ 1 ตัว กรุณาติดต่อผู้ดูแลระบบ',
}
const OPEN = process.env.NEXT_PUBLIC_OPEN_AT ? new Date(process.env.NEXT_PUBLIC_OPEN_AT).getTime() : 0

export default function Shop() {
  const [stock, setStock] = useState({})
  const [cart, setCart] = useState({})
  const [view, setView] = useState('shop')
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

  useEffect(() => {
    setCart((c) => {
      let changed = false
      const next = {}
      for (const [k, q] of Object.entries(c)) {
        const max = stock[k]?.remaining
        const v = max === undefined ? q : Math.min(q, max)
        if (v !== q) changed = true
        if (v > 0) next[k] = v
      }
      return changed ? next : c
    })
  }, [stock])

  const open = now >= OPEN
  const seconds = Math.max(0, Math.ceil((OPEN - now) / 1000))
  const total = SIZES.reduce((a, k) => a + (stock[k]?.total || 0), 0)
  const left = SIZES.reduce((a, k) => a + (stock[k]?.remaining || 0), 0)
  const basePrice = SIZES.map((k) => stock[k]?.price).find((p) => p > 0) || 250
  const items = SIZES.filter((k) => cart[k] > 0).map((k) => ({ size: k, qty: cart[k], price: Number(stock[k]?.price) || basePrice }))
  const count = items.reduce((a, it) => a + it.qty, 0)
  const sum = items.reduce((a, it) => a + it.qty * it.price, 0)
  const canBuy = open && count > 0 && !busy

  const setQty = (k, v) => {
    const max = stock[k]?.remaining ?? 0
    const q = Math.max(0, Math.min(Math.floor(v), max))
    setCart((c) => {
      const n = { ...c }
      if (q > 0) n[k] = q
      else delete n[k]
      return n
    })
    setMsg('')
  }
  const go = (v) => { setView(v); setMsg(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  async function buy() {
    setMsg('')
    if (!f.name.trim() || !f.dept.trim()) return setMsg('กรอกชื่อและแผนกให้ครบ')
    if (!/^[A-Za-z0-9]{6}$/.test(f.code.trim())) return setMsg('รหัสพนักงานต้องมี 6 ตัว')
    setBusy(true)
    const r = await fetch('/api/buy', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...f, items: items.map(({ size, qty }) => ({ size, qty })) }),
    })
    const j = await r.json().catch(() => ({}))
    setBusy(false)
    if (!r.ok) {
      if (j.error === 'SOLD_OUT') return setMsg(`ไซส์ ${j.size} เหลือเพียง ${j.left} ตัว กรุณาปรับจำนวน`)
      return setMsg(ERR[j.error] || 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง')
    }
    setDone({ ids: j.ids, total: j.total, items, ...f })
    setCart({})
    setView('shop')
  }
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  return (
    <div className="wrap">
      <SiteHeader open={open} />
      <main>
        {view === 'shop' ? (
          <>
            <Hero open={open} seconds={seconds} total={total} left={left} price={basePrice} />
            <div className="checkout">
              <div className="checkout-main">
                <SizePicker sizes={SIZES} stock={stock} cart={cart} onQty={setQty} open={open} flash={flash} />
              </div>
              <CartSidebar items={items} count={count} sum={sum} canNext={count > 0} onNext={() => go('review')} />
            </div>
          </>
        ) : (
          <div className="checkout">
            <div className="checkout-main">
              <ReviewItems items={items} stock={stock} onQty={setQty} onRemove={(k) => setQty(k, 0)} onBack={() => go('shop')} />
              <EmployeeForm form={f} onChange={set} />
            </div>
            <TotalCard items={items} count={count} sum={sum} canBuy={canBuy} busy={busy} onBuy={buy} msg={msg} />
          </div>
        )}
      </main>
      <footer className="site-footer">NISSEI 40th Anniversary · จัดทำโดย แผนกสำนักประธาน</footer>
      {view === 'shop' ? (
        <MobileBar count={count} sum={sum} label="ดูสรุปยอด" disabled={count < 1} onClick={() => go('review')} />
      ) : (
        <MobileBar count={count} sum={sum} label={busy ? 'กำลังสั่งซื้อ...' : 'ยืนยันสั่งซื้อ'} disabled={!canBuy} onClick={buy} msg={msg} />
      )}
      {done && <SuccessModal order={done} onClose={() => setDone(null)} />}
    </div>
  )
}
