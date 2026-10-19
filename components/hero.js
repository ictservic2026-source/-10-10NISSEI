const p2 = (n) => String(n).padStart(2, '0')

function Countdown({ seconds }) {
  const parts = [
    [Math.floor(seconds / 3600), 'ชั่วโมง'],
    [Math.floor((seconds % 3600) / 60), 'นาที'],
    [seconds % 60, 'วินาที'],
  ]
  return (
    <div className="countdown" aria-label="เวลาก่อนเปิดขาย">
      <span className="countdown-label">เปิดขายใน</span>
      <div className="countdown-tiles">
        {parts.map(([v, label]) => (
          <div className="cd-tile" key={label}>
            <b>{p2(v)}</b>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

const DETAILS = [
  { src: '/detail-cuff.webp', label: 'ชายแขนติดกระดุมแปะ' },
  { src: '/detail-hem.webp', label: 'ชายเสื้อทรงตรง ด้านหลังมีกระดุมแปะ' },
]

export default function Hero({ open, seconds, total, left, price }) {
  const sold = total - left
  const pct = total ? (sold / total) * 100 : 0
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">NISSEI 40th Anniversary</p>
        <h1 id="hero-title">
          <span className="h1-en">Jacket</span>
          <span className="h1-th">ราคาพิเศษ</span>
        </h1>

        <div className="price-row">
          <p className="price">
            <b>{Number(price).toLocaleString()}</b>
            <span>บาท</span>
          </p>
          <span className="limited">มีจำนวนจำกัด</span>
        </div>

        <p className="hero-lead">
          แจ็คเก็ตที่ระลึกครบรอบ 40 ปี สำหรับพนักงาน NISSEI
          <br />
          1 รหัสพนักงาน สั่งซื้อได้ 1 ตัว
        </p>

        {!open && <Countdown seconds={seconds} />}

        <div className="stock-meter">
          <div className="stock-meter-head">
            <span>
              ขายแล้ว <strong>{sold}</strong> / {total} ตัว
            </span>
            <span className="stock-left">เหลือ {left} ตัว</span>
          </div>
          <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={sold} aria-label="ยอดขาย">
            <i style={{ width: pct + '%' }} />
          </div>
        </div>
      </div>

      <div className="hero-product">
        <div className="product-stage">
          <img
            src="/jacket-main.webp"
            alt="แจ็คเก็ต NISSEI ครบรอบ 40 ปี สีน้ำเงิน ซิปหน้า คอตั้ง"
            width={710}
            height={640}
            className="jacket"
            fetchPriority="high"
          />
        </div>
        <ul className="details" aria-label="รายละเอียดเสื้อ">
          {DETAILS.map((d) => (
            <li key={d.src} className="detail">
              <img src={d.src} alt="" width={278} height={196} loading="lazy" />
              <span>{d.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
