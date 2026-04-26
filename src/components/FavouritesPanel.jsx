import React from 'react'
import FavouriteButton from './FavouriteButton'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function FavouritesPanel({
  favourites,
  currentStation,
  isFavourite,
  onPlay,
  onToggleFav,
  onClear,
  onClose,
}) {
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'

  return (
    <div style={{
      ...styles.panel,
      width: isMobile ? '100%' : 320,
    }}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="#ef4444" style={{ filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.6))' }}>
            <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.6 8 3.5C8.8 2.6 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" />
          </svg>
          <span style={styles.title}>FAVOURITES</span>
          <span style={styles.count}>{favourites.length}</span>
        </div>
        <div style={styles.headerRight}>
          {favourites.length > 0 && (
            <button onClick={onClear} style={styles.clearBtn}>CLEAR ALL</button>
          )}
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* List */}
      <div style={styles.list}>
        {favourites.length === 0 ? (
          <div style={styles.empty}>
            <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="#1e293b" strokeWidth="1">
              <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.6 8 3.5C8.8 2.6 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" />
            </svg>
            <span style={styles.emptyText}>NO FAVOURITES YET</span>
            <span style={styles.emptySub}>Tap ♥ on any station to save it</span>
          </div>
        ) : (
          favourites
            .slice()
            .sort((a, b) => b.savedAt - a.savedAt)
            .map((station, idx) => {
              const isActive = currentStation?.stationuuid === station.stationuuid
              return (
                <div
                  key={station.stationuuid}
                  onClick={() => onPlay(station)}
                  style={{
                    ...styles.row,
                    ...(isActive ? styles.rowActive : {}),
                  }}
                >
                  {/* Icon */}
                  <div style={styles.iconWrap}>
                    <div style={styles.iconPlaceholder}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#334155" strokeWidth="1.5" />
                        <circle cx="12" cy="12" r="4" stroke="#334155" strokeWidth="1.5" />
                        <line x1="12" y1="2" x2="12" y2="6" stroke="#334155" strokeWidth="1.5" />
                      </svg>
                    </div>
                    {station.favicon && (
                      <img
                        src={station.favicon}
                        alt=""
                        style={styles.icon}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div style={styles.info}>
                    <span style={{
                      ...styles.name,
                      color: isActive ? '#f8fafc' : '#cbd5e1',
                    }}>
                      {station.name}
                    </span>
                    <div style={styles.meta}>
                      {station.country && (
                        <span style={styles.metaTag}>{station.country.toUpperCase()}</span>
                      )}
                      {station.codec && (
                        <span style={styles.metaTag}>{station.codec}</span>
                      )}
                    </div>
                  </div>

                  {/* Wave indicator */}
                  {isActive && (
                    <div style={styles.waveWrap}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{ ...styles.wave, animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  )}

                  {/* Remove fav */}
                  <FavouriteButton
                    isFav={true}
                    onToggle={() => onToggleFav(station)}
                    size="sm"
                  />
                </div>
              )
            })
        )}
      </div>
    </div>
  )
}

const styles = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #0a0f1a 0%, #020617 100%)',
    borderLeft: '1px solid #1e293b',
    flexShrink: 0,
    overflow: 'hidden',
    animation: 'slideInRight 0.25s cubic-bezier(0.4,0,0.2,1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '10px',
    color: '#94a3b8',
    letterSpacing: '0.25em',
    fontWeight: 700,
  },
  count: {
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    color: '#ef4444',
    background: '#7f1d1d',
    border: '1px solid #ef444440',
    borderRadius: 10,
    padding: '1px 6px',
    letterSpacing: '0.05em',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  clearBtn: {
    background: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: 3,
    color: '#334155',
    fontFamily: 'Share Tech Mono',
    fontSize: '8px',
    letterSpacing: '0.1em',
    padding: '4px 8px',
    cursor: 'pointer',
    transition: 'color 0.15s, border-color 0.15s',
  },
  closeBtn: {
    background: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: 3,
    color: '#475569',
    fontFamily: 'Share Tech Mono',
    fontSize: '10px',
    padding: '4px 8px',
    cursor: 'pointer',
    transition: 'color 0.15s',
  },
  divider: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, #1e293b 30%, #1e293b 70%, transparent)',
    flexShrink: 0,
  },
  list: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '48px 20px',
  },
  emptyText: {
    fontFamily: 'Share Tech Mono',
    fontSize: '11px',
    color: '#1e293b',
    letterSpacing: '0.15em',
  },
  emptySub: {
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    color: '#1e293b',
    letterSpacing: '0.08em',
    textAlign: 'center',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderBottom: '1px solid #0f172a',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  rowActive: {
    background: '#0a0f1a',
    borderLeft: '2px solid #ef4444',
  },
  iconWrap: {
    position: 'relative',
    width: 32,
    height: 32,
    borderRadius: 4,
    overflow: 'hidden',
    flexShrink: 0,
    background: '#0f172a',
    border: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'relative',
    zIndex: 1,
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minWidth: 0,
  },
  name: {
    fontFamily: 'Share Tech Mono',
    fontSize: '11px',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    display: 'flex',
    gap: 4,
  },
  metaTag: {
    fontFamily: 'Share Tech Mono',
    fontSize: '8px',
    color: '#334155',
    letterSpacing: '0.08em',
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 2,
    padding: '1px 4px',
  },
  waveWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    height: 12,
    flexShrink: 0,
  },
  wave: {
    width: 2,
    height: 8,
    background: '#ef4444',
    borderRadius: 1,
    animation: 'dotPulse 0.6s ease-in-out infinite alternate',
  },
}
