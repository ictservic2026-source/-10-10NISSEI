import QtyStepper from './qty-stepper'

export const baht = (p) => '฿' + Number(p || 0).toLocaleString()

export function EmployeeForm({ form, onChange }) {
  return (
    <section className="panel" aria-labelledby="form-title">
      <div className="panel-head">
        <span className="step">2</span>
        <div>
          <h2 id="form-title">ข้อมูลพนักงาน</h2>
          <p>กรอกให้ตรงกับข้อมูลในระบบ HR</p>
        </div>
      </div>
      <div className="fields">
        <div className="field field-wide">
          <label htmlFor="f-name">ชื่อ-นามสกุล</label>
          <input id="f-name" autoComplete="name" value={form.name} onChange={onChange('name')} placeholder="สมชาย ใจดี" />
        </div>
        <div className="field">
          <label htmlFor="f-code">รหัสพนักงาน (6 ตัว)</label>
          <input id="f-code" inputMode="text" autoCapitalize="characters" value={form.code} onChange={onChange('code')} maxLength={6} placeholder="684251" />
        </div>
        <div className="field">
          <label htmlFor="f-dept">แผนก / หน่วยงาน</label>
          <input id="f-dept" value={form.dept} onChange={onChange('dept')} placeholder="เช่น ผลิต, QA, บัญชี" />
        </div>
      </div>
    </section>
  )
}

function Thumb() {
  return (
    <div className="summary-thumb">
      <img src="/jacket-main.webp" alt="" width={710} height={640} />
    </div>
  )
}

export function CartSidebar({ items, count, sum, canNext, onNext }) {
  return (
    <aside className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">ตะกร้าของคุณ</h2>
      {items.length === 0 ? (
        <p className="empty">ยังไม่ได้เลือกสินค้า</p>
      ) : (
        <ul className="mini-cart">
          {items.map((it) => (
            <li key={it.size}>
              <span>ไซส์ {it.size} × {it.qty}</span>
              <b>{baht(it.price * it.qty)}</b>
            </li>
          ))}
        </ul>
      )}
      <div className="summary-total">
        <span>รวม {count} ตัว</span>
        <b>{baht(sum)}</b>
      </div>
      <button type="button" className="btn-primary" disabled={!canNext} onClick={onNext}>
        ไปหน้าสรุปยอด
      </button>
    </aside>
  )
}

export function ReviewItems({ items, stock, onQty, onRemove, onBack }) {
  return (
    <section className="panel" aria-labelledby="review-title">
      <div className="review-head">
        <button type="button" className="btn-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          เลือกเพิ่ม
        </button>
        <h2 id="review-title">สรุปยอดคำสั่งซื้อ</h2>
      </div>
      {items.length === 0 ? (
        <p className="empty">ไม่มีสินค้าในรายการ กด “เลือกเพิ่ม” เพื่อเลือกไซส์</p>
      ) : (
        <ul className="review-list">
          {items.map((it) => (
            <li key={it.size} className="review-item">
              <Thumb />
              <div className="review-info">
                <b>NISSEI 40th Jacket</b>
                <span>ไซส์ {it.size} · {baht(it.price)}/ตัว</span>
                <span className="review-left">เหลือในสต๊อก {stock[it.size]?.remaining ?? 0} ตัว</span>
              </div>
              <div className="review-actions">
                <b className="review-line">{baht(it.price * it.qty)}</b>
                <div className="review-ctrl">
                  <QtyStepper label={`ไซส์ ${it.size}`} value={it.qty} max={stock[it.size]?.remaining ?? 0} onChange={(v) => onQty(it.size, v)} />
                  <button type="button" className="btn-remove" aria-label={`ลบไซส์ ${it.size}`} onClick={() => onRemove(it.size)}>
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function TotalCard({ items, count, sum, canBuy, busy, onBuy, msg }) {
  return (
    <aside className="summary" aria-labelledby="total-title">
      <h2 id="total-title">ยอดชำระ</h2>
      <ul className="mini-cart">
        {items.map((it) => (
          <li key={it.size}>
            <span>ไซส์ {it.size} × {it.qty}</span>
            <b>{baht(it.price * it.qty)}</b>
          </li>
        ))}
      </ul>
      <div className="summary-total">
        <span>รวม {count} ตัว</span>
        <b>{baht(sum)}</b>
      </div>
      <button type="button" className="btn-primary" disabled={!canBuy} onClick={onBuy}>
        {busy ? 'กำลังสั่งซื้อ...' : 'ยืนยันสั่งซื้อ'}
      </button>
      <p className="msg" role="alert">{msg}</p>
    </aside>
  )
}

export function MobileBar({ count, sum, label, disabled, onClick, msg }) {
  return (
    <div className="buybar">
      {msg && <p className="buybar-msg" role="alert">{msg}</p>}
      <div className="buybar-row">
        <div className="buybar-info">
          <small>{count ? `${count} ตัว` : 'ยังไม่ได้เลือก'}</small>
          <b>{baht(sum)}</b>
        </div>
        <button type="button" className="btn-primary" disabled={disabled} onClick={onClick}>
          {label}
        </button>
      </div>
    </div>
  )
}
