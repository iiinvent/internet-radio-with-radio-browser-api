import React, { useRef } from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function TagStrip({ tags, activeTag, onSelect, loading }) {
  const scrollRef = useRef(null)
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'

  return (
    <div style={styles.wrap}>
      {loading && (
        <span style={styles.loadingDot}>●</span>
      )}
      <div
        ref={scrollRef}
        style={{ ...styles.strip, paddingLeft: isMobile ? 10 : 16 }}
      >
        {tags.map(tag => {
          const isActive = tag === activeTag
          return (
            <button
              key={tag}
              onClick={() => onSelect(isActive ? '' : tag)}
              style={{
                ...styles.tag,
                ...(isActive ? styles.tagActive : {}),
                fontSize: isMobile ? '8px' : '9px',
                padding: isMobile ? '3px 8px' : '4px 10px',
              }}
            >
              {tag.toUpperCase()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: '#020617',
    borderBottom: '1px solid #1e293b',
    flexShrink: 0,
    overflow: 'hidden',
  },
  loadingDot: {
    position: 'absolute',
    left: 6,
    color: '#ef4444',
    fontSize: '6px',
    animation: 'dotBlink 1s infinite',
    zIndex: 1,
  },
  strip: {
    display: 'flex',
    gap: 6,
    overflowX: 'auto',
    padding: '7px 16px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  tag: {
    background: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: 2,
    color: '#334155',
    fontFamily: 'Share Tech Mono',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  tagActive: {
    background: '#7f1d1d',
    border: '1px solid #ef4444',
    color: '#fca5a5',
  },
}
