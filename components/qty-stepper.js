export default function QtyStepper({ value, max, onChange, disabled, label }) {
  return (
    <div className="stepper" role="group" aria-label={`จำนวน ${label}`}>
      <button type="button" aria-label={`ลด ${label}`} disabled={disabled || value < 1} onClick={() => onChange(value - 1)}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label={`เพิ่ม ${label}`} disabled={disabled || value >= max} onClick={() => onChange(value + 1)}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
      </button>
    </div>
  )
}
