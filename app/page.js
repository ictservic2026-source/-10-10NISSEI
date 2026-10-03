'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseBrowser'
import Shirt from './shirt'

const SIZES = ['SS', 'S', 'M', 'L', 'XL']
const ERR = { SOLD_OUT: 'ไซส์นี้หมดแล้ว ลองไซส์อื่น', ALREADY_ORDERED: 'รหัสพนักงานนี้สั่งซื้อไปแล้ว', INVALID_CODE: 'รหัสพนักงานต้องมี 6 ตัว', NOT_OPEN: 'ยังไม่ถึงเวลาเปิดขาย' }
const OPEN = process.env.NEXT_PUBLIC_OPEN_AT ? new Date(process.env.NEXT_PUBLIC_OPEN_AT).getTime() : 0
const p2 = (n) => String(n).padStart(2, '0')

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
  const s = Math.max(0, Math.ceil((OPEN - now) / 1000))
  const total = SIZES.reduce((a, k) => a + (stock[k]?.total || 0), 0)
  const left = SIZES.reduce((a, k) => a + (stock[k]?.remaining || 0), 0)
  const price = stock[sel]?.price
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

  return (<div className="wrap">
    <nav><div className="lg"><img src="/logo.png" alt="NISSEI" /><span className="logo">10:10 STAFF DROP</span></div></nav>
    <div className="hero">
      <div>
        <img src="/logo.png" className="hl" alt="NISSEI" />
        <h1>เสื้อ Limited Edition<br />เฉพาะพนักงาน</h1>
        <p>เปิดขาย 10:10 น. · มีเพียง {total || '-'} ตัวเท่านั้น · 1 รหัสพนักงาน ซื้อได้ 1 ตัว</p>
        {!open && <div className="cd"><div><b>{p2(Math.floor(s / 3600))}</b><small>ชั่วโมง</small></div><i>:</i><div><b>{p2(Math.floor(s % 3600 / 60))}</b><small>นาที</small></div><i>:</i><div><b>{p2(s % 60)}</b><small>วินาที</small></div></div>}
        <span className="live">{open ? <b style={{ color: '#35d49a' }}>● กำลังเปิดขาย</b> : 'รอเปิดขาย'}</span>
        <div className="prog"><i style={{ width: total ? (total - left) / total * 100 + '%' : 0 }} /></div>
        <small style={{ color: '#a4abc8' }}>ขายไปแล้ว {total - left} จาก {total} ตัว · เหลือ {left}</small>
      </div>
      <div className="shirt"><Shirt /></div>
    </div>
    <h2>เลือกไซส์ของคุณ</h2>
    <div className="sizes">{SIZES.map((k) => { const l = stock[k]?.remaining ?? 0, t = stock[k]?.total || 1, low = l > 0 && l <= 5
      return (<button key={k} className={`sz ${sel === k ? 'sel' : ''} ${low ? 'low' : ''} ${flash === k ? 'flash' : ''}`} disabled={l < 1 || !open} onClick={() => setSel(k)}>
        <div className="ring" style={{ '--p': l / t * 100 }}><b>{k}</b></div>
        <div className="l">{l < 1 ? 'หมดแล้ว' : low ? `เหลือ ${l} ตัวสุดท้าย!` : `เหลือ ${l} ตัว`}</div></button>) })}</div>
    <h2>ยืนยันการสั่งซื้อ</h2>
    <div className="form">
      <div><label>ชื่อ-นามสกุล</label><input value={f.name} onChange={set('name')} placeholder="สมชาย ใจดี" /></div>
      <div><label>รหัสพนักงาน (6 ตัว)</label><input value={f.code} onChange={set('code')} maxLength={6} placeholder="684251" /></div>
      <div><label>แผนก / หน่วยงาน</label><input value={f.dept} onChange={set('dept')} placeholder="พิมพ์เองได้ เช่น ผลิต, QA, บัญชี" /></div>
      <div className="buy"><div>ไซส์ <b>{sel || '-'}</b><div className="tot">{price > 0 ? '฿' + Number(price).toLocaleString() : 'ราคาแจ้งภายหลัง'}</div></div>
        <button className="go" disabled={!canBuy} onClick={buy}>{busy ? 'กำลังสั่งซื้อ...' : 'สั่งซื้อเลย'}</button></div>
      <div className="msg err">{msg}</div>
    </div>
    {done && <div className="modal"><div className="tkt"><div style={{ fontSize: 42 }}>🎉</div><h3>สั่งซื้อสำเร็จ</h3>
      <div style={{ color: '#a4abc8' }}>เลขที่ออเดอร์ #{String(done.id).padStart(4, '0')}</div>
      <dl><dt>ชื่อ</dt><dd>{done.name}</dd><dt>รหัส / แผนก</dt><dd>{done.code.toUpperCase()} · {done.dept}</dd><dt>ไซส์</dt><dd>{done.size} × 1</dd></dl>
      <button className="go" style={{ padding: '12px 36px' }} onClick={() => setDone(null)}>ตกลง</button></div></div>}
  </div>)
}
