'use client'
import { useEffect, useState } from 'react'
const SIZES = ['SS', 'S', 'M', 'L', 'XL']

export default function Admin() {
  const [pw, setPw] = useState(''), [ok, setOk] = useState(false), [err, setErr] = useState('')
  const [d, setD] = useState({ orders: [], stock: [] })

  const load = async (p = pw) => {
    const r = await fetch('/api/admin/orders', { headers: { 'x-admin-password': p }, cache: 'no-store' })
    if (!r.ok) { setOk(false); return false }
    setD(await r.json()); setOk(true); return true
  }
  useEffect(() => { const p = sessionStorage.getItem('ap'); if (p) { setPw(p); load(p) } }, [])
  useEffect(() => { if (!ok) return; const t = setInterval(() => load(), 3000); return () => clearInterval(t) }, [ok, pw])

  async function login() { setErr(''); if (await load()) sessionStorage.setItem('ap', pw); else setErr('รหัสผ่านไม่ถูกต้อง') }
  async function cancel(id) {
    if (!confirm('ยกเลิกออเดอร์นี้และคืนสต๊อก?')) return
    await fetch('/api/admin/orders', { method: 'POST', headers: { 'x-admin-password': pw, 'content-type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }
  function csv() {
    const rows = [['เวลา', 'ชื่อ', 'รหัส', 'แผนก', 'ไซส์', 'ราคา', 'สถานะ'], ...d.orders.map((o) => [o.created_at, o.emp_name, o.emp_code, o.dept, o.size, o.price, o.status])]
    const t = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + t], { type: 'text/csv' })); a.download = 'orders.csv'; a.click()
  }

  if (!ok) return (<div className="wrap"><div className="form" style={{ maxWidth: 380, margin: '80px auto' }}>
    <div><label>รหัสผ่านแอดมิน</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()} /></div>
    <div className="buy"><span className="msg err">{err}</span><button className="go" onClick={login}>เข้าสู่ระบบ</button></div></div></div>)

  const sold = d.orders.filter((o) => o.status === 'ok')
  const st = Object.fromEntries(d.stock.map((s) => [s.size, s]))
  const left = d.stock.reduce((a, s) => a + s.remaining, 0)
  const dm = {}; sold.forEach((o) => (dm[o.dept] = (dm[o.dept] || 0) + 1))
  const ks = Object.keys(dm).sort((a, b) => dm[b] - dm[a]).slice(0, 8), mx = Math.max(1, ...Object.values(dm))
  const rev = sold.reduce((a, o) => a + Number(o.price), 0)

  return (<div className="wrap">
    <nav><div className="lg"><img src="/logo.png" alt="NISSEI" /><span className="logo">Control Room</span></div>
      <div className="tabs"><button className="on" onClick={csv}>ดาวน์โหลด CSV</button></div></nav>
    <div className="kpis">{[['ผู้สั่งซื้อ', sold.length], ['คงเหลือ (ตัว)', left], ['ยอดรวม', '฿' + rev.toLocaleString()]].map((x) => <div className="kpi" key={x[0]}><b>{x[1]}</b><span>{x[0]}</span></div>)}</div>
    <div className="grid2" style={{ marginTop: 14 }}>
      <div className="card"><b>สต๊อกแยกไซส์</b>{SIZES.map((k) => <div className="br" key={k}><span>{k}</span><div><i style={{ width: (st[k] ? st[k].remaining / st[k].total * 100 : 0) + '%' }} /></div><span>{st[k]?.remaining ?? 0}/{st[k]?.total ?? 0}</span></div>)}</div>
      <div className="card"><b>ผู้ซื้อแยกแผนก</b>{ks.map((k) => <div className="br" key={k}><span>{k}</span><div><i style={{ width: dm[k] / mx * 100 + '%' }} /></div><span>{dm[k]}</span></div>)}</div>
    </div>
    <h2>รายการสั่งซื้อ</h2>
    <div className="tw"><table><thead><tr><th>เวลา</th><th>ชื่อ</th><th>รหัส</th><th>แผนก</th><th>ไซส์</th><th>ราคา</th><th></th></tr></thead>
      <tbody>{d.orders.slice(0, 100).map((o) => <tr key={o.id} style={o.status !== 'ok' ? { opacity: .4, textDecoration: 'line-through' } : {}}>
        <td>{new Date(o.created_at).toLocaleTimeString('th-TH', { hour12: false })}</td><td>{o.emp_name}</td><td>{o.emp_code}</td><td>{o.dept}</td><td>{o.size}</td><td>฿{o.price}</td>
        <td>{o.status === 'ok' && <button className="sm" onClick={() => cancel(o.id)}>ยกเลิก</button>}</td></tr>)}</tbody></table></div>
  </div>)
}
