export default function SuccessModal({ order, onClose }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="ok-title">
      <div className="ticket">
        <div className="ticket-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h3 id="ok-title">สั่งซื้อสำเร็จ</h3>
        <p className="ticket-id">เลขที่ออเดอร์ #{String(order.id).padStart(4, '0')}</p>
        <dl>
          <dt>ชื่อ</dt>
          <dd>{order.name}</dd>
          <dt>รหัส / แผนก</dt>
          <dd>{order.code.toUpperCase()} · {order.dept}</dd>
          <dt>ไซส์</dt>
          <dd>{order.size} × 1</dd>
        </dl>
        <p className="ticket-note">กรุณาแคปหน้าจอนี้เก็บไว้เป็นหลักฐาน</p>
        <button type="button" className="btn-primary" onClick={onClose} autoFocus>ตกลง</button>
      </div>
    </div>
  )
}
