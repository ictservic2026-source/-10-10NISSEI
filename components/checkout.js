export function EmployeeForm({ form, onChange }) {
  return (
    <section className="panel" aria-labelledby="form-title">
      <div className="panel-head">
        <span className="step">02</span>
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
          <input id="f-code" inputMode="text" value={form.code} onChange={onChange('code')} maxLength={6} placeholder="684251" />
        </div>
        <div className="field">
          <label htmlFor="f-dept">แผนก / หน่วยงาน</label>
          <input id="f-dept" value={form.dept} onChange={onChange('dept')} placeholder="เช่น ผลิต, QA, บัญชี" />
        </div>
      </div>
    </section>
  )
}

export function OrderSummary({ size, price, canBuy, busy, onBuy, msg }) {
  return (
    <aside className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">สรุปคำสั่งซื้อ</h2>
      <div className="summary-item">
        <div className="summary-thumb">
          <img src="/jacket.png" alt="" />
        </div>
        <div>
          <b>40th Anniversary Jacket</b>
          <span>Limited Edition · 1 ตัว</span>
        </div>
      </div>
      <dl className="summary-rows">
        <dt>ไซส์</dt>
        <dd>{size || 'ยังไม่ได้เลือก'}</dd>
        <dt>จำนวน</dt>
        <dd>1</dd>
      </dl>
      <div className="summary-total">
        <span>ยอดรวม</span>
        <b>{price > 0 ? '฿' + Number(price).toLocaleString() : 'แจ้งภายหลัง'}</b>
      </div>
      <button type="button" className="btn-primary" disabled={!canBuy} onClick={onBuy}>
        {busy ? 'กำลังสั่งซื้อ...' : 'สั่งซื้อเลย'}
      </button>
      <p className="msg" role="alert">{msg}</p>
      <p className="summary-note">1 รหัสพนักงาน สั่งซื้อได้เพียง 1 ครั้ง</p>
    </aside>
  )
}
