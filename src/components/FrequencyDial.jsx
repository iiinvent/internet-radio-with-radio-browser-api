import React, { useRef, useState, useCallback } from 'react'

const STATIONS_COUNT = 40

export default function FrequencyDial({ stations, currentStation, onSelect, size = 240 }) {
  const svgRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [angle, setAngle] = useState(0)
  const dragStart = useRef(null)
  const debounceTimer = useRef(null)
  const lastSelectedIndex = useRef(-1)

  const cx = size / 2
  const cy = size / 2
  const r = size * 0.375

  const freqMin = 87.5
  const freqMax = 108.0

  const stationAngles = stations.slice(0, STATIONS_COUNT).map((_, i) => {
    const maxIndex = Math.max(stations.length - 1, 1)
    return -150 + (i / maxIndex) * 300
  })

  const currentIndex = currentStation
    ? stations.findIndex(s => s.stationuuid === currentStation.stationuuid)
    : -1

  const needleAngle = currentIndex >= 0 && currentIndex < STATIONS_COUNT
    ? stationAngles[currentIndex]
    : angle

  const freq = freqMin + ((needleAngle + 150) / 300) * (freqMax - freqMin)

  function getAngleFromEvent(e) {
    const svg = svgRef.current
    if (!svg) return 0
    const rect = svg.getBoundingClientRect()
    const scaleX = size / rect.width
    const scaleY = size / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const x = (clientX - rect.left) * scaleX - cx
    const y = (clientY - rect.top) * scaleY - cy
    return Math.atan2(y, x) * (180 / Math.PI)
  }

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    const a = getAngleFromEvent(e)
    dragStart.current = { startAngle: a, dialAngle: angle }
    setDragging(true)
  }, [angle])

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !dragStart.current) return
    const a = getAngleFromEvent(e)
    let delta = a - dragStart.current.startAngle
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    const newAngle = Math.max(-150, Math.min(150, dragStart.current.dialAngle + delta))
    setAngle(newAngle)

    const ratio = (newAngle + 150) / 300
    const stationCount = Math.min(stations.length, STATIONS_COUNT)
    const closestIndex = Math.round(ratio * (stationCount - 1))

    if (closestIndex !== lastSelectedIndex.current && closestIndex >= 0 && closestIndex < stationCount) {
      lastSelectedIndex.current = closestIndex
      const station = stations[closestIndex]
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        if (station) onSelect(station)
      }, 300)
    }
  }, [dragging, stations, onSelect])

  const handleMouseUp = useCallback(() => {
    setDragging(false)
    dragStart.current = null
  }, [])

  const toXY = (angleDeg, radius) => {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  const needlePos = toXY(needleAngle, r - 10)
  const needleBase1 = toXY(needleAngle + 90, 6)
  const needleBase2 = toXY(needleAngle - 90, 6)

  const scaleFactor = size / 240

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none', touchAction: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <defs>
          <radialGradient id="dialGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <radialGradient id="dialInner" cx="45%" cy="40%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="70%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <radialGradient id="hubGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="outerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer bezel ring */}
        <circle cx={cx} cy={cy} r={r + 22 * scaleFactor} fill="#0a0f1a" stroke="#0f172a" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r + 20 * scaleFactor} fill="url(#dialGrad)" stroke="#1e3a5f" strokeWidth="1.5" />

        {/* Decorative outer ring glow */}
        <circle cx={cx} cy={cy} r={r + 20 * scaleFactor} fill="none" stroke="#1d4ed8" strokeWidth="0.5" opacity="0.3" filter="url(#outerGlow)" />

        {/* Frequency scale ticks */}
        {Array.from({ length: 41 }).map((_, i) => {
          const a = -150 + i * 7.5
          const isMajor = i % 5 === 0
          const isMid = i % 5 === 2 || i % 5 === 3
          const inner = toXY(a, r + 5 * scaleFactor)
          const outer = toXY(a, r + (isMajor ? 16 : isMid ? 10 : 7) * scaleFactor)
          return (
            <line
              key={i}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke={isMajor ? '#60a5fa' : isMid ? '#334155' : '#1e293b'}
              strokeWidth={isMajor ? 1.5 * scaleFactor : 0.8 * scaleFactor}
              opacity={isMajor ? 0.9 : 0.6}
            />
          )
        })}

        {/* Freq labels */}
        {[88, 92, 96, 100, 104, 108].map((f) => {
          const ratio = (f - freqMin) / (freqMax - freqMin)
          const a = -150 + ratio * 300
          const pos = toXY(a, r + 26 * scaleFactor)
          return (
            <text
              key={f}
              x={pos.x} y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#3b82f6"
              fontSize={7 * scaleFactor}
              fontFamily="Share Tech Mono"
              opacity="0.8"
            >{f}</text>
          )
        })}

        {/* Station dots on scale */}
        {stations.slice(0, STATIONS_COUNT).map((s, i) => {
          const a = stationAngles[i]
          const pos = toXY(a, r + 1 * scaleFactor)
          const isActive = s.stationuuid === currentStation?.stationuuid
          return (
            <circle
              key={s.stationuuid}
              cx={pos.x} cy={pos.y}
              r={isActive ? 4 * scaleFactor : 2 * scaleFactor}
              fill={isActive ? '#ef4444' : '#334155'}
              filter={isActive ? 'url(#glow)' : undefined}
              opacity={isActive ? 1 : 0.7}
            />
          )
        })}

        {/* Dial face with metallic look */}
        <circle cx={cx} cy={cy} r={r - 6 * scaleFactor} fill="url(#dialInner)" stroke="#1e293b" strokeWidth="2" />

        {/* Inner decorative rings */}
        <circle cx={cx} cy={cy} r={r - 14 * scaleFactor} fill="none" stroke="#1e293b" strokeWidth="0.8" opacity="0.5" />
        <circle cx={cx} cy={cy} r={r - 22 * scaleFactor} fill="none" stroke="#1e293b" strokeWidth="0.5" opacity="0.3" />

        {/* Radial tick marks on face */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = i * 15
          const inner = toXY(a, r - 28 * scaleFactor)
          const outer = toXY(a, r - 22 * scaleFactor)
          return (
            <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="#1e293b" strokeWidth="0.6" opacity="0.4" />
          )
        })}

        {/* Needle shadow */}
        <polygon
          points={`${needlePos.x + 1},${needlePos.y + 1} ${needleBase1.x + 1},${needleBase1.y + 1} ${needleBase2.x + 1},${needleBase2.y + 1}`}
          fill="#000"
          opacity="0.4"
        />

        {/* Needle */}
        <polygon
          points={`${needlePos.x},${needlePos.y} ${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y}`}
          fill="#ef4444"
          filter="url(#glow)"
          opacity="0.95"
        />
        <line
          x1={cx} y1={cy}
          x2={needlePos.x} y2={needlePos.y}
          stroke="#ef4444"
          strokeWidth={1.5 * scaleFactor}
          filter="url(#glow)"
        />

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={10 * scaleFactor} fill="url(#hubGrad)" stroke="#475569" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={6 * scaleFactor} fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={3 * scaleFactor} fill="#ef4444" filter="url(#softGlow)" />

        {/* Frequency display */}
        <rect
          x={cx - 36 * scaleFactor} y={cy + 22 * scaleFactor}
          width={72 * scaleFactor} height={16 * scaleFactor}
          rx={3 * scaleFactor}
          fill="#020617"
          stroke="#1e3a5f"
          strokeWidth="1"
        />
        <text
          x={cx} y={cy + 31 * scaleFactor}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ef4444"
          fontSize={9 * scaleFactor}
          fontFamily="Share Tech Mono"
          filter="url(#softGlow)"
        >
          {freq.toFixed(1)} MHz
        </text>
      </svg>
    </div>
  )
}
