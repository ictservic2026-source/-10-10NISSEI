const p2 = (n) => String(n).padStart(2, '0')

function Countdown({ seconds }) {
  const parts = [
    [Math.floor(seconds / 3600), 'ชั่วโมง'],
    [Math.floor((seconds % 3600) / 60), 'นาที'],
    [seconds % 60, 'วินาที'],
  ]
  return (
    <div className="countdown" aria-label="เวลาก่อนเปิดขาย">
      {parts.map(([v, label], i) => (
        <div className="cd-group" key={label}>
          {i > 0 && <span className="cd-sep" aria-hidden="true">:</span>}
          <div className="cd-tile">
            <b>{p2(v)}</b>
            <small>{label}</small>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Hero({ open, seconds, total, left, price }) {
  const sold = total - left
  const pct = total ? (sold / total) * 100 : 0
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-badge">40</span>
          Anniversary · Limited Edition
        </p>
        <h1 id="hero-title">
          NISSEI 40th
          <span>Anniversary Jacket</span>
        </h1>
        <p className="hero-lead">
          แจ็คเก็ตที่ระลึกครบรอบ 40 ปี สำหรับพนักงานเท่านั้น
          มีเพียง <strong>{total || '-'} ตัว</strong> · 1 รหัสพนักงาน ซื้อได้ 1 ตัว
        </p>

        {!open && <Countdown seconds={seconds} />}

        <div className="stock-meter">
          <div className="stock-meter-head">
            <span>ขายไปแล้ว <strong>{sold}</strong> / {total} ตัว</span>
            <span className="stock-left">เหลือ {left} ตัว</span>
          </div>
          <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={sold} aria-label="ยอดขาย">
            <i style={{ width: pct + '%' }} />
          </div>
        </div>
      </div>

      <div className="hero-product">
        <div className="product-stage">
          <img src="/jacket.png" alt="แจ็คเก็ต NISSEI 40th Anniversary สีน้ำเงิน" className="jacket" />
        </div>
        <div className="price-tag">
          <small>ราคาพนักงาน</small>
          <b>{price > 0 ? '฿' + Number(price).toLocaleString() : 'แจ้งภายหลัง'}</b>
        </div>
      </div>
    </section>
  )
}
