import React, { useRef, useState, useCallback } from 'react'

export default function Knob({ label, value, min, max, onChange, color = '#ef4444', size = 72 }) {
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef(null)

  const ratio = (value - min) / (max - min)
  const angle = -135 + ratio * 270
  const s = size / 72 // scale factor

  const cx = size / 2
  const cy = size / 2

  const toXY = (angleDeg, r) => {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  const indicatorOuter = toXY(angle, 22 * s)
  const indicatorInner = toXY(angle, 14 * s)

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
    const r = 26 * s
    const start = toXY(startAngle, r)
    const end = toXY(endAngle, r)
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const trackArcPath = () => {
    const startAngle = -135
    const endAngle = 135
    const r = 26 * s
    const start = toXY(startAngle, r)
    const end = toXY(endAngle, r)
    return `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`
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
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ cursor: dragging ? 'ns-resize' : 'grab', userSelect: 'none', touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <defs>
          <radialGradient id={`knobGrad-${label}`} cx="38%" cy="32%">
            <stop offset="0%" stopColor="#2d4a6b" />
            <stop offset="40%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <radialGradient id={`knobShine-${label}`} cx="35%" cy="25%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id={`knobGlow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`knobShadow-${label}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Outer shadow ring */}
        <circle cx={cx} cy={cy} r={32 * s} fill="#020617" opacity="0.6" />

        {/* Track background arc */}
        <path
          d={trackArcPath()}
          fill="none"
          stroke="#0f172a"
          strokeWidth={4 * s}
          strokeLinecap="round"
        />

        {/* Track dots */}
        {Array.from({ length: 11 }).map((_, i) => {
          const a = -135 + i * 27
          const pos = toXY(a, 26 * s)
          return (
            <circle key={i} cx={pos.x} cy={pos.y} r={1 * s}
              fill={i * 27 <= (angle + 135) ? color : '#1e293b'}
              opacity={i * 27 <= (angle + 135) ? 0.6 : 0.3}
            />
          )
        })}

        {/* Active arc */}
        <path
          d={arcPath()}
          fill="none"
          stroke={color}
          strokeWidth={3 * s}
          strokeLinecap="round"
          filter={`url(#knobGlow-${label})`}
          opacity="0.9"
        />

        {/* Knob body shadow */}
        <circle cx={cx + 1 * s} cy={cy + 2 * s} r={20 * s} fill="#000" opacity="0.5" />

        {/* Knob body */}
        <circle cx={cx} cy={cy} r={20 * s} fill={`url(#knobGrad-${label})`} stroke="#1e3a5f" strokeWidth={1.5 * s} filter={`url(#knobShadow-${label})`} />

        {/* Knob shine */}
        <circle cx={cx} cy={cy} r={20 * s} fill={`url(#knobShine-${label})`} />

        {/* Knurling marks around edge */}
        {Array.from({ length: 20 }).map((_, i) => {
          const a = i * 18
          const inner = toXY(a, 16 * s)
          const outer = toXY(a, 19 * s)
          return (
            <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="#334155" strokeWidth={0.8 * s} opacity="0.5" />
          )
        })}

        {/* Inner ring detail */}
        <circle cx={cx} cy={cy} r={12 * s} fill="none" stroke="#1e293b" strokeWidth={0.8 * s} opacity="0.6" />

        {/* Indicator line */}
        <line
          x1={indicatorInner.x} y1={indicatorInner.y}
          x2={indicatorOuter.x} y2={indicatorOuter.y}
          stroke={color}
          strokeWidth={2.5 * s}
          strokeLinecap="round"
          filter={`url(#knobGlow-${label})`}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={2.5 * s} fill={color} opacity="0.4" />
      </svg>
      <span style={{
        fontFamily: 'Share Tech Mono',
        fontSize: `${9 * s}px`,
        color: '#475569',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginTop: 2,
      }}>{label}</span>
    </div>
  )
}
