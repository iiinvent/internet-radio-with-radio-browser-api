import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function TagStrip({ tags, activeTag, onSelect, loading }) {
  const scrollRef = useRef(null)

  function scroll(dir) {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
    }
  }

  return (
    <div style={styles.wrapper}>
      <button style={styles.arrow} onClick={() => scroll(-1)}>
        <ChevronLeft size={14} color="#64748b" />
      </button>

      <div ref={scrollRef} style={styles.strip}>
        {loading ? (
          <span style={styles.loadingText}>Loading tags...</span>
        ) : (
          tags.map(tag => (
            <button
              key={tag}
              style={{
                ...styles.tag,
                ...(activeTag === tag ? styles.tagActive : {}),
              }}
              onClick={() => onSelect(activeTag === tag ? '' : tag)}
            >
              {tag}
            </button>
          ))
        )}
      </div>

      <button style={styles.arrow} onClick={() => scroll(1)}>
        <ChevronRight size={14} color="#64748b" />
      </button>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
    padding: '0 8px',
    gap: 4,
  },
  strip: {
    display: 'flex',
    gap: 4,
    overflowX: 'auto',
    padding: '8px 4px',
    flex: 1,
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  tag: {
    flexShrink: 0,
    background: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: 2,
    color: '#475569',
    fontSize: '10px',
    fontFamily: 'Share Tech Mono',
    padding: '4px 10px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  tagActive: {
    background: '#7f1d1d',
    border: '1px solid #ef4444',
    color: '#fca5a5',
  },
  arrow: {
    background: 'transparent',
    border: 'none',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  loadingText: {
    fontFamily: 'Share Tech Mono',
    fontSize: '10px',
    color: '#334155',
    padding: '4px 8px',
  },
}
