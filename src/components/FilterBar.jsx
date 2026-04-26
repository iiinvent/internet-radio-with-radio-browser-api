import React from 'react'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function FilterBar({ filters, countries, languages, onUpdate, onClear }) {
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'

  const hasFilters = filters.country || filters.language || filters.tag || filters.search

  return (
    <div style={{ ...styles.bar, flexWrap: isMobile ? 'wrap' : 'nowrap', gap: isMobile ? 6 : 8 }}>
      <input
        type="text"
        placeholder="SEARCH STATIONS..."
        value={filters.search || ''}
        onChange={e => onUpdate('search', e.target.value)}
        style={{ ...styles.input, flex: isMobile ? '1 1 100%' : '1 1 180px', minWidth: 0 }}
      />

      <select
        value={filters.country || ''}
        onChange={e => onUpdate('country', e.target.value)}
        style={{ ...styles.select, flex: isMobile ? '1 1 calc(50% - 3px)' : '0 0 140px' }}
      >
        <option value="">ALL COUNTRIES</option>
        {countries.map(c => (
          <option key={c.iso_3166_1_alpha_2} value={c.iso_3166_1_alpha_2}>
            {c.name.toUpperCase()}
          </option>
        ))}
      </select>

      <select
        value={filters.language || ''}
        onChange={e => onUpdate('language', e.target.value)}
        style={{ ...styles.select, flex: isMobile ? '1 1 calc(50% - 3px)' : '0 0 130px' }}
      >
        <option value="">ALL LANGUAGES</option>
        {languages
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
          .map(l => (
            <option key={l.name} value={l.name}>
              {l.name.toUpperCase()}
            </option>
          ))}
      </select>

      {hasFilters && (
        <button onClick={onClear} style={styles.clearBtn}>✕ CLEAR</button>
      )}
    </div>
  )
}

const styles = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    background: '#0a0f1a',
    borderBottom: '1px solid #1e293b',
    flexShrink: 0,
  },
  input: {
    background: '#020617',
    border: '1px solid #1e293b',
    borderRadius: 4,
    color: '#94a3b8',
    fontFamily: 'Share Tech Mono',
    fontSize: '10px',
    letterSpacing: '0.1em',
    padding: '7px 10px',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  select: {
    background: '#020617',
    border: '1px solid #1e293b',
    borderRadius: 4,
    color: '#94a3b8',
    fontFamily: 'Share Tech Mono',
    fontSize: '10px',
    letterSpacing: '0.08em',
    padding: '7px 8px',
    outline: 'none',
    cursor: 'pointer',
    minWidth: 0,
  },
  clearBtn: {
    background: 'transparent',
    border: '1px solid #334155',
    borderRadius: 4,
    color: '#475569',
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    letterSpacing: '0.1em',
    padding: '7px 10px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'color 0.15s, border-color 0.15s',
  },
}
