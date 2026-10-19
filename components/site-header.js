export default function SiteHeader({ open }) {
  return (
    <header className="topbar">
      <div className="brand">
        <img src="/logo.png" alt="NISSEI" className="brand-logo" />
        <span className="brand-divider" aria-hidden="true" />
        <span className="brand-name">10:10 Staff Drop</span>
      </div>
      <span className={`status-pill ${open ? 'is-open' : ''}`} role="status">
        <span className="status-dot" aria-hidden="true" />
        {open ? 'กำลังเปิดขาย' : 'รอเปิดขาย 10:10 น.'}
      </span>
    </header>
  )
}
