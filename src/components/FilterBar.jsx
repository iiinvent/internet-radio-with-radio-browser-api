import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

const CODECS = ['', 'MP3', 'AAC', 'AAC+', 'OGG', 'FLAC', 'WMA']
const BITRATES = [
  { label: 'Any', value: '' },
  { label: '32+', value: '32' },
  { label: '64+', value: '64' },
  { label: '128+', value: '128' },
  { label: '192+', value: '192' },
  { label: '320+', value: '320' },
]

export default function FilterBar({ filters, countries, languages, onUpdate, onClear }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const hasFilters = Object.values(filters).some(Boolean)

  function handleSearch(e) {
    e.preventDefault()
    if (searchVal.trim()) {
      onUpdate('tag', searchVal.trim().toLowerCase())
      setSearchOpen(false)
      setSearchVal('')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        {/* Country */}
        <div style={styles.selectWrap}>
          <label style={styles.label}>Country</label>
          <select
            style={styles.select}
            value={filters.country}
            onChange={e => onUpdate('country', e.target.value)}
          >
            <option value="">All</option>
            {countries.map(c => (
              <option key={c.iso_3166_1} value={c.iso_3166_1}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div style={styles.selectWrap}>
          <label style={styles.label}>Language</label>
          <select
            style={styles.select}
            value={filters.language}
            onChange={e => onUpdate('language', e.target.value)}
          >
            <option value="">All</option>
            {languages.slice(0, 100).map(l => (
              <option key={l.name} value={l.name}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Bitrate */}
        <div style={styles.selectWrap}>
          <label style={styles.label}>Bitrate</label>
          <div style={styles.btnGroup}>
            {BITRATES.map(b => (
              <button
                key={b.value}
                style={{
                  ...styles.smallBtn,
                  ...(filters.bitrateMin === b.value ? styles.smallBtnActive : {}),
                }}
                onClick={() => onUpdate('bitrateMin', b.value)}
              >{b.label}</button>
            ))}
          </div>
        </div>

        {/* Codec */}
        <div style={styles.selectWrap}>
          <label style={styles.label}>Type</label>
          <div style={styles.btnGroup}>
            {CODECS.map(c => (
              <button
                key={c}
                style={{
                  ...styles.smallBtn,
                  ...(filters.codec === c ? styles.smallBtnActive : {}),
                }}
                onClick={() => onUpdate('codec', c)}
              >{c || 'Any'}</button>
            ))}
          </div>
        </div>

        {/* Search + Clear */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <button
            style={styles.iconBtn}
            onClick={() => setSearchOpen(v => !v)}
            title="Search by name/tag"
          >
            <Search size={16} color="#94a3b8" />
          </button>
          {hasFilters && (
            <button style={styles.clearBtn} onClick={onClear} title="Clear filters">
              <X size={14} color="#ef4444" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={handleSearch} style={styles.searchRow}>
          <input
            autoFocus
            style={styles.searchInput}
            placeholder="Search stations, tags..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
          />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>
      )}
    </div>
  )
}

const styles = {
  container: {
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
    padding: '12px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    alignItems: 'flex-end',
  },
  selectWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    color: '#475569',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  select: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 4,
    color: '#cbd5e1',
    fontSize: '12px',
    padding: '5px 8px',
    outline: 'none',
    cursor: 'pointer',
    minWidth: 120,
  },
  btnGroup: {
    display: 'flex',
    gap: 3,
    flexWrap: 'wrap',
  },
  smallBtn: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 3,
    color: '#64748b',
    fontSize: '10px',
    fontFamily: 'Share Tech Mono',
    padding: '4px 7px',
    transition: 'all 0.15s',
  },
  smallBtnActive: {
    background: '#7f1d1d',
    border: '1px solid #ef4444',
    color: '#fca5a5',
  },
  iconBtn: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 4,
    padding: '6px 10px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s',
  },
  clearBtn: {
    background: 'transparent',
    border: '1px solid #7f1d1d',
    borderRadius: 4,
    color: '#ef4444',
    fontSize: '11px',
    fontFamily: 'Share Tech Mono',
    padding: '5px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    transition: 'all 0.15s',
  },
  searchRow: {
    display: 'flex',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 4,
    color: '#f8fafc',
    fontSize: '13px',
    padding: '7px 12px',
    outline: 'none',
    maxWidth: 320,
  },
  searchBtn: {
    background: '#7f1d1d',
    border: '1px solid #ef4444',
    borderRadius: 4,
    color: '#fca5a5',
    fontSize: '12px',
    fontFamily: 'Share Tech Mono',
    padding: '7px 16px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
}
