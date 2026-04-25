import React, { useRef, useState, useCallback } from 'react'

const STATIONS_COUNT = 40

export default function FrequencyDial({ stations, currentStation, onSelect }) {
  const svgRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [angle, setAngle] = useState(0)
  const dragStart = useRef(null)
  const debounceTimer = useRef(null)
  const lastSelectedIndex = useRef(-1)

  const cx = 120
  const cy = 120
  const r = 90

  const freqMin = 87.5
  const freqMax = 108.0

  // Calculate angles for each station
  const stationAngles = stations.slice(0, STATIONS_COUNT).map((_, i) => {
    const maxIndex = Math.max(stations.length - 1, 1)
    return -150 + (i / maxIndex) * 300
  })

  // Find current station index
  const currentIndex = currentStation
    ? stations.findIndex(s => s.stationuuid === currentStation.stationuuid)
    : -1

  // Get needle angle - either from current station or from manual drag
  const needleAngle = currentIndex >= 0 && currentIndex < STATIONS_COUNT
    ? stationAngles[currentIndex]
    : angle

  // Calculate frequency display
  const freq = freqMin + ((needleAngle + 150) / 300) * (freqMax - freqMin)

  function getAngleFromEvent(e) {
    const svg = svgRef.current
    if (!svg) return 0
    const rect = svg.getBoundingClientRect()
    const scaleX = 240 / rect.width
    const scaleY = 240 / rect.height
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

    // Normalize delta to -180 to 180
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360

    // Calculate new angle with bounds
    const newAngle = Math.max(-150, Math.min(150, dragStart.current.dialAngle + delta))
    setAngle(newAngle)

    // Map angle to station index
    const ratio = (newAngle + 150) / 300
    const stationCount = Math.min(stations.length, STATIONS_COUNT)
    const exactIndex = ratio * (stationCount - 1)
    const closestIndex = Math.round(exactIndex)

    // Only trigger selection if station index changed
    if (closestIndex !== lastSelectedIndex.current && closestIndex >= 0 && closestIndex < stationCount) {
      lastSelectedIndex.current = closestIndex
      const station = stations[closestIndex]

      // Clear existing debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      // Debounce the station selection
      debounceTimer.current = setTimeout(() => {
        if (station) {
          onSelect(station)
        }
      }, 300)
    }
  }, [dragging, stations, onSelect])

  const handleMouseUp = useCallback(() => {
    setDragging(false)
    dragStart.current = null
  }, [])

  const toXY = (angleDeg, radius) => {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  const needlePos = toXY(needleAngle, r - 10)
  const needleBase1 = toXY(needleAngle + 90, 6)
  const needleBase2 = toXY(needleAngle - 90, 6)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg
        ref={svgRef}
        width="240"
        height="240"
        viewBox="0 0 240 240"
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
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <radialGradient id="dialInner" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={r + 18} fill="url(#dialGrad)" stroke="#334155" strokeWidth="1" />

        {/* Frequency scale arc */}
        {Array.from({ length: 21 }).map((_, i) => {
          const a = -150 + i * 15
          const isMajor = i % 5 === 0
          const inner = toXY(a, r + 4)
          const outer = toXY(a, r + (isMajor ? 14 : 9))
          return (
            <line
              key={i}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke={isMajor ? '#94a3b8' : '#475569'}
              strokeWidth={isMajor ? 1.5 : 0.8}
            />
          )
        })}

        {/* Freq labels */}
        {[88, 92, 96, 100, 104, 108].map((f) => {
          const ratio = (f - freqMin) / (freqMax - freqMin)
          const a = -150 + ratio * 300
          const pos = toXY(a, r + 22)
          return (
            <text
              key={f}
              x={pos.x} y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#64748b"
              fontSize="7"
              fontFamily="Share Tech Mono"
            >{f}</text>
          )
        })}

        {/* Station dots */}
        {stations.slice(0, STATIONS_COUNT).map((s, i) => {
          const a = stationAngles[i]
          const pos = toXY(a, r - 2)
          const isActive = s.stationuuid === currentStation?.stationuuid
          return (
            <circle
              key={s.stationuuid}
              cx={pos.x} cy={pos.y} r={isActive ? 3.5 : 2}
              fill={isActive ? '#ef4444' : '#475569'}
              filter={isActive ? 'url(#glow)' : undefined}
            />
          )
        })}

        {/* Dial face */}
        <circle cx={cx} cy={cy} r={r - 8} fill="url(#dialInner)" stroke="#1e293b" strokeWidth="2" />

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
          strokeWidth="1.5"
          filter="url(#glow)"
        />

        {/* Center hub */}
        <circle cx={cx} cy={cy} r={8} fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={3} fill="#ef4444" />

        {/* Frequency display */}
        <text
          x={cx} y={cy + 30}
          textAnchor="middle"
          fill="#ef4444"
          fontSize="11"
          fontFamily="Share Tech Mono"
          filter="url(#glow)"
        >
          {freq.toFixed(1)} MHz
        </text>
      </svg>
    </div>
  )
}
