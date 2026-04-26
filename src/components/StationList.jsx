import React from 'react'
import FavouriteButton from './FavouriteButton'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function StationList({ stations, currentStation, onPlay, onToggleFav, isFavourite, loading, error }) {
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'

  if (loading) return (
    <div style={styles.center}>
      <div style={styles.scanLine} />
      <span style={styles.loadingText}>SCANNING FREQUENCIES...</span>
      <div style={styles.dots}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.3}s` }}>●</span>
        ))}
      </div>
    </div>
  )

  if (error) return (
    <div style={styles.center}>
      <span style={styles.errorText}>⚠ SIGNAL LOST</span>
      <span style={styles.errorSub}>{error}</span>
    </div>
  )

  if (!stations.length) return (
    <div style={styles.center}>
      <span style={styles.errorText}>NO STATIONS FOUND</span>
      <span style={styles.errorSub}>Try adjusting your filters</span>
    </div>
  )

  return (
    <div style={styles.list}>
      {stations.map((station, idx) => {
        const isActive = currentStation?.stationuuid === station.stationuuid
        const isFav = isFavourite(station.stationuuid)
        return (
          <div
            key={station.stationuuid}
            className="station-card"
            onClick={() => onPlay(station)}
            style={{
              ...styles.card,
              ...(isActive ? styles.cardActive : {}),
              padding: isMobile ? '10px 12px' : '12px 16px',
            }}
          >
            {/* Index */}
            <span style={{ ...styles.index, minWidth: isMobile ? 24 : 28 }}>
              {String(idx + 1).padStart(2, '0')}
            </span>

            {/* Icon */}
            <div style={{ ...styles.iconWrap, width: isMobile ? 32 : 38, height: isMobile ? 32 : 38 }}>
              <div style={styles.iconPlaceholder}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
                fontSize: isMobile ? '11px' : '12px',
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
                {station.bitrate > 0 && (
                  <span style={styles.metaTag}>{station.bitrate}k</span>
                )}
              </div>
            </div>

            {/* Right side */}
            <div style={styles.right}>
              {isActive && (
                <div style={styles.waveWrap}>
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{ ...styles.wave, animationDelay: `${i * 0.12}s` }} />
                  ))}
                </div>
              )}
              {station.votes > 0 && !isMobile && (
                <span style={styles.votes}>▲ {station.votes > 999 ? `${(station.votes / 1000).toFixed(1)}k` : station.votes}</span>
              )}
              <FavouriteButton
                isFav={isFav}
                onToggle={() => onToggleFav(station)}
                size={isMobile ? 'sm' : 'md'}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderBottom: '1px solid #0f172a',
    cursor: 'pointer',
    transition: 'background 0.15s',
    background: 'transparent',
  },
  cardActive: {
    background: '#0a0f1a',
    borderLeft: '2px solid #ef4444',
  },
  index: {
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    color: '#1e293b',
    letterSpacing: '0.05em',
    flexShrink: 0,
    textAlign: 'right',
  },
  iconWrap: {
    position: 'relative',
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
    fontWeight: 400,
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
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
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
  },
  waveWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    height: 14,
  },
  wave: {
    width: 2,
    height: 10,
    background: '#ef4444',
    borderRadius: 1,
    animation: 'dotPulse 0.6s ease-in-out infinite alternate',
  },
  votes: {
    fontFamily: 'Share Tech Mono',
    fontSize: '8px',
    color: '#334155',
    letterSpacing: '0.05em',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '60px 20px',
  },
  scanLine: {
    width: 120,
    height: 2,
    background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
    animation: 'scan 2s ease-in-out infinite',
  },
  loadingText: {
    fontFamily: 'Share Tech Mono',
    fontSize: '11px',
    color: '#334155',
    letterSpacing: '0.15em',
  },
  dots: {
    display: 'flex',
    gap: 6,
  },
  dot: {
    fontFamily: 'Share Tech Mono',
    fontSize: '8px',
    color: '#ef4444',
    animation: 'dotBlink 1s ease-in-out infinite',
  },
  errorText: {
    fontFamily: 'Share Tech Mono',
    fontSize: '13px',
    color: '#ef4444',
    letterSpacing: '0.15em',
  },
  errorSub: {
    fontFamily: 'Share Tech Mono',
    fontSize: '10px',
    color: '#334155',
    letterSpacing: '0.1em',
  },
}
