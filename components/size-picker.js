export default function SizePicker({ sizes, stock, selected, onSelect, open, flash }) {
  return (
    <section className="panel" aria-labelledby="size-title">
      <div className="panel-head">
        <span className="step">01</span>
        <div>
          <h2 id="size-title">เลือกไซส์ของคุณ</h2>
          <p>สต๊อกอัปเดตแบบเรียลไทม์</p>
        </div>
      </div>
      <div className="sizes" role="radiogroup" aria-label="ไซส์">
        {sizes.map((k) => {
          const l = stock[k]?.remaining ?? 0
          const t = stock[k]?.total || 1
          const soldOut = l < 1
          const low = !soldOut && l <= 5
          const cls = ['size', selected === k && 'is-selected', low && 'is-low', soldOut && 'is-out', flash === k && 'is-flash']
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={selected === k}
              className={cls}
              disabled={soldOut || !open}
              onClick={() => onSelect(k)}
            >
              <span className="size-label">{k}</span>
              <span className="size-bar" aria-hidden="true">
                <i style={{ width: (l / t) * 100 + '%' }} />
              </span>
              <span className="size-left">{soldOut ? 'หมดแล้ว' : low ? `เหลือ ${l} ตัวสุดท้าย` : `เหลือ ${l} ตัว`}</span>
            </button>
          )
        })}
      </div>
      {!open && <p className="hint">ปุ่มเลือกไซส์จะเปิดให้กดเมื่อถึงเวลา 10:10 น.</p>}
    </section>
  )
}
