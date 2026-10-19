const baht = (p) => (p > 0 ? '฿' + Number(p).toLocaleString() : '-')

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

function BuyButton({ canBuy, busy, onBuy }) {
  return (
    <button type="button" className="btn-primary" disabled={!canBuy} onClick={onBuy}>
      {busy ? 'กำลังสั่งซื้อ...' : 'สั่งซื้อเลย'}
    </button>
  )
}

export function OrderSummary({ size, price, canBuy, busy, onBuy, msg }) {
  return (
    <aside className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">สรุปคำสั่งซื้อ</h2>
      <div className="summary-item">
        <div className="summary-thumb">
          <img src="/jacket-main.webp" alt="" width={710} height={640} />
        </div>
        <div>
          <b>NISSEI 40th Jacket</b>
          <span>ไซส์ {size || '-'} · 1 ตัว</span>
        </div>
      </div>
      <div className="summary-total">
        <span>ยอดชำระ</span>
        <b>{baht(price)}</b>
      </div>
      <div className="summary-cta">
        <BuyButton canBuy={canBuy} busy={busy} onBuy={onBuy} />
      </div>
      <p className="msg" role="alert">{msg}</p>
      <p className="summary-note">1 รหัสพนักงาน สั่งซื้อได้เพียง 1 ครั้ง</p>
    </aside>
  )
}

export function MobileBuyBar({ size, price, canBuy, busy, onBuy, msg }) {
  return (
    <div className="buybar">
      {msg && <p className="buybar-msg" role="alert">{msg}</p>}
      <div className="buybar-row">
        <div className="buybar-info">
          <small>{size ? `ไซส์ ${size}` : 'ยังไม่ได้เลือกไซส์'}</small>
          <b>{baht(price)}</b>
        </div>
        <BuyButton canBuy={canBuy} busy={busy} onBuy={onBuy} />
      </div>
    </div>
  )
}
