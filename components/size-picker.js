import QtyStepper from './qty-stepper'

export default function SizePicker({ sizes, stock, cart, onQty, open, flash }) {
  return (
    <section className="panel" aria-labelledby="size-title">
      <div className="panel-head">
        <span className="step">1</span>
        <div>
          <h2 id="size-title">เลือกไซส์และจำนวน</h2>
          <p>{'กด + / − เพื่อเพิ่มหรือลดจำนวน เลือกได้หลายไซส์'}</p>
        </div>
      </div>
      <ul className="size-list">
        {sizes.map((k) => {
          const l = stock[k]?.remaining ?? 0
          const t = stock[k]?.total || 1
          const q = cart[k] || 0
          const soldOut = l < 1
          const low = !soldOut && l <= 5
          const cls = ['size-row', q > 0 && 'is-picked', low && 'is-low', soldOut && 'is-out', flash === k && 'is-flash']
            .filter(Boolean)
            .join(' ')
          return (
            <li key={k} className={cls}>
              <span className="size-badge">{k}</span>
              <div className="size-info">
                <span className="size-left">{soldOut ? 'หมดแล้ว' : `เหลือ ${l} ตัว`}</span>
                <span className="size-bar" aria-hidden="true">
                  <i style={{ width: (l / t) * 100 + '%' }} />
                </span>
              </div>
              <QtyStepper label={`ไซส์ ${k}`} value={q} max={l} disabled={!open || soldOut} onChange={(v) => onQty(k, v)} />
            </li>
          )
        })}
      </ul>
      {!open && <p className="hint">ปุ่มเลือกจำนวนจะกดได้เมื่อถึงเวลา 10:10 น.</p>}
    </section>
  )
}
