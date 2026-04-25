import React, { useRef, useState, useCallback } from 'react'

export default function Knob({ label, value, min, max, onChange, color = '#ef4444' }) {
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef(null)

  const ratio = (value - min) / (max - min)
  const angle = -135 + ratio * 270

  const toXY = (angleDeg, r) => {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return { x: 36 + r * Math.cos(rad), y: 36 + r * Math.sin(rad) }
  }

  const indicatorOuter = toXY(angle, 22)
  const indicatorInner = toXY(angle, 14)

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    dragRef.current = { startY: e.clientY ?? e.touches?.[0]?.clientY, startVal: value }
    setDragging(true)
  }, [value])

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !dragRef.current) return
    const clientY = e.clientY ?? e.touches?.[0]?.clientY
    const delta = (dragRef.current.startY - clientY) / 100
    const newVal = Math.max(min, Math.min(max, dragRef.current.startVal + delta * (max - min)))
    onChange(newVal)
  }, [dragging, min, max, onChange])

  const handleMouseUp = useCallback(() => {
    setDragging(false)
    dragRef.current = null
  }, [])

  const arcPath = () => {
    const startAngle = -135
    const endAngle = angle
    const r = 26
    const start = toXY(startAngle, r)
    const end = toXY(endAngle, r)
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <svg
        width="72" height="72"
        viewBox="0 0 72 72"
        style={{ cursor: dragging ? 'ns-resize' : 'grab', userSelect: 'none', touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <defs>
          <radialGradient id={`knobGrad-${label}`} cx="40%" cy="35%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <filter id={`knobGlow-${label}`}>
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle cx="36" cy="36" r="26" fill="none" stroke="#1e293b" strokeWidth="4" />

        {/* Active arc */}
        <path
          d={arcPath()}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          filter={`url(#knobGlow-${label})`}
          opacity="0.8"
        />

        {/* Knob body */}
        <circle cx="36" cy="36" r="20" fill={`url(#knobGrad-${label})`} stroke="#334155" strokeWidth="1.5" />

        {/* Tick marks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const a = -135 + i * 27
          const inner = toXY(a, 16)
          const outer = toXY(a, 19)
          return (
            <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="#334155" strokeWidth="1" />
          )
        })}

        {/* Indicator line */}
        <line
          x1={indicatorInner.x} y1={indicatorInner.y}
          x2={indicatorOuter.x} y2={indicatorOuter.y}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          filter={`url(#knobGlow-${label})`}
        />
      </svg>
      <span style={{
        fontFamily: 'Share Tech Mono',
        fontSize: '9px',
        color: '#64748b',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  )
}
