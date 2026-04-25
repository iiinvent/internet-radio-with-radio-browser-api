import React from 'react'

export default function FilterBar({
  filters,
  countries,
  languages,
  onUpdate,
  onClear,
}) {
  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <div style={styles.group}>
          <label style={styles.label}>COUNTRY</label>
          <select
            value={filters.country}
            onChange={e => onUpdate('country', e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            {countries.map(c => (
              <option key={c.iso_3166_1_alpha_2} value={c.iso_3166_1_alpha_2}>
                {c.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>LANGUAGE</label>
          <select
            value={filters.language}
            onChange={e => onUpdate('language', e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            {languages.map(l => (
              <option key={l.iso_639} value={l.name}>
                {l.name.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>BITRATE</label>
          <select
            value={filters.bitrate}
            onChange={e => onUpdate('bitrate', e.target.value)}
            style={styles.select}
          >
            <option value="">Any</option>
            <option value="128">128 kbps+</option>
            <option value="192">192 kbps+</option>
            <option value="256">256 kbps+</option>
            <option value="320">320 kbps+</option>
          </select>
        </div>

        <div style={styles.group}>
          <label style={styles.label}>CODEC</label>
          <select
            value={filters.codec}
            onChange={e => onUpdate('codec', e.target.value)}
            style={styles.select}
          >
            <option value="">Any</option>
            <option value="MP3">MP3</option>
            <option value="AAC">AAC</option>
            <option value="OGG">OGG</option>
            <option value="FLAC">FLAC</option>
          </select>
        </div>

        <button style={styles.clearBtn} onClick={onClear}>
          CLEAR
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
    padding: '12px 16px',
  },
  row: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    color: '#64748b',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  select: {
    background: '#1e293b',
    border: '1px solid #334155',
    color: '#e2e8f0',
    fontFamily: 'Share Tech Mono',
    fontSize: '12px',
    padding: '6px 8px',
    borderRadius: '2px',
    cursor: 'pointer',
    minWidth: '120px',
  },
  clearBtn: {
    background: '#ef4444',
    border: 'none',
    color: '#fff',
    fontFamily: 'Share Tech Mono',
    fontSize: '10px',
    letterSpacing: '0.1em',
    padding: '6px 12px',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
}
