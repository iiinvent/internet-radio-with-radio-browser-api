import React from 'react'
import Knob from './Knob'
import FavouriteButton from './FavouriteButton'
import { useBreakpoint } from '../hooks/useBreakpoint'

export default function Player({
  currentStation, isPlaying, volume,
  onToggle, onStop, onVolumeChange,
  isFavourite, onToggleFav,
  favouriteCount, onOpenFavourites,
}) {
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'
  const knobSize = isMobile ? 52 : isTablet ? 60 : 72

  return (
    <div style={{
      ...styles.player,
      padding: isMobile ? '8px 12px' : '10px 20px',
      gap: isMobile ? 8 : 14,
    }}>
      {/* Station icon + info */}
      <div style={{ ...styles.stationInfo, gap: isMobile ? 8 : 12, minWidth: 0, flex: 1 }}>
        <div style={{
          ...styles.stationIconWrap,
          width: isMobile ? 36 : 44,
          height: isMobile ? 36 : 44,
        }}>
          <div style={styles.stationIconPlaceholder}>
            <svg width={isMobile ? 14 : 18} height={isMobile ? 14 : 18} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#334155" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" stroke="#334155" strokeWidth="1.5" />
              <line x1="12" y1="2" x2="12" y2="6" stroke="#334155" strokeWidth="1.5" />
            </svg>
          </div>
          {currentStation?.favicon && (
            <img
              src={currentStation.favicon}
              alt=""
              style={styles.stationIcon}
              onError={e => { e.target.style.display = 'none' }}
            />
          )}
        </div>

        <div style={styles.stationText}>
          <span style={{
            ...styles.stationName,
            fontSize: isMobile ? '10px' : '12px',
          }}>
            {currentStation ? currentStation.name : 'NO STATION SELECTED'}
          </span>
          {currentStation && (
            <div style={styles.stationMeta}>
              {currentStation.country && (
                <span style={styles.metaChip}>{currentStation.country.toUpperCase()}</span>
              )}
              {currentStation.codec && (
                <span style={styles.metaChip}>{currentStation.codec}</span>
              )}
              {currentStation.bitrate > 0 && (
                <span style={styles.metaChip}>{currentStation.bitrate}k</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Waveform */}
      {isPlaying && !isMobile && (
        <div style={styles.waveform}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              ...styles.waveBar,
              animationDelay: `${i * 0.08}s`,
              height: 4 + Math.sin(i * 0.8) * 8,
            }} />
          ))}
        </div>
      )}

      {/* Controls */}
      <div style={{ ...styles.controls, gap: isMobile ? 8 : 12 }}>
        {/* Fav button for current station */}
        {currentStation && (
          <FavouriteButton
            isFav={isFavourite(currentStation.stationuuid)}
            onToggle={() => onToggleFav(currentStation)}
            size={isMobile ? 'sm' : 'md'}
          />
        )}

        {/* Play/Pause */}
        <button
          onClick={onToggle}
          disabled={!currentStation}
          style={{
            ...styles.playBtn,
            width: isMobile ? 36 : 44,
            height: isMobile ? 36 : 44,
            opacity: currentStation ? 1 : 0.3,
          }}
        >
          {isPlaying ? (
            <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 16 16" fill="#f8fafc">
              <rect x="2" y="2" width="4" height="12" rx="1" />
              <rect x="10" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width={isMobile ? 14 : 16} height={isMobile ? 14 : 16} viewBox="0 0 16 16" fill="#f8fafc">
              <polygon points="3,1 15,8 3,15" />
            </svg>
          )}
        </button>

        {/* Volume knob */}
        <div style={styles.knobWrap}>
          <Knob
            label="VOL"
            value={volume}
            min={0}
            max={1}
            onChange={onVolumeChange}
            color="#ef4444"
            size={knobSize}
          />
        </div>
      </div>

      {/* VU meter */}
      {isPlaying && (
        <div style={{ ...styles.vuMeter, display: isMobile ? 'none' : 'flex' }}>
          <span style={styles.vuLabel}>VU</span>
          <div style={styles.vuBars}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                ...styles.vuBar,
                background: i < 5 ? '#22c55e' : i < 7 ? '#fbbf24' : '#ef4444',
                animationDelay: `${i * 0.07}s`,
                opacity: isPlaying ? 1 : 0.1,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* Favourites tray button */}
      <button
        onClick={onOpenFavourites}
        style={{
          ...styles.favTrayBtn,
          borderColor: favouriteCount > 0 ? '#7f1d1d' : '#1e293b',
        }}
        title="Open favourites"
      >
        <svg width="12" height="12" viewBox="0 0 16 16"
          fill={favouriteCount > 0 ? '#ef4444' : 'none'}
          stroke={favouriteCount > 0 ? '#ef4444' : '#334155'}
          strokeWidth="1.5"
          style={{ filter: favouriteCount > 0 ? 'drop-shadow(0 0 3px rgba(239,68,68,0.5))' : 'none' }}
        >
          <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.6 8 3.5C8.8 2.6 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" />
        </svg>
        {favouriteCount > 0 && (
          <span style={styles.favBadge}>{favouriteCount}</span>
        )}
      </button>
    </div>
  )
}

const styles = {
  player: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(180deg, #0a0f1a 0%, #020617 100%)',
    borderTop: '1px solid #1e293b',
    flexShrink: 0,
    zIndex: 20,
    position: 'relative',
  },
  stationInfo: {
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
  },
  stationIconWrap: {
    position: 'relative',
    borderRadius: 6,
    overflow: 'hidden',
    flexShrink: 0,
    background: '#0f172a',
    border: '1px solid #1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationIconPlaceholder: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  stationIcon: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'relative',
    zIndex: 1,
  },
  stationText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minWidth: 0,
  },
  stationName: {
    fontFamily: 'Share Tech Mono',
    color: '#cbd5e1',
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  stationMeta: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
  },
  metaChip: {
    fontFamily: 'Share Tech Mono',
    fontSize: '8px',
    color: '#334155',
    letterSpacing: '0.08em',
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 2,
    padding: '1px 4px',
  },
  waveform: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    height: 28,
    flexShrink: 0,
  },
  waveBar: {
    width: 3,
    background: '#ef4444',
    borderRadius: 2,
    animation: 'dotPulse 0.5s ease-in-out infinite alternate',
    opacity: 0.8,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  playBtn: {
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    border: '1px solid #334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
    transition: 'transform 0.1s, box-shadow 0.1s',
  },
  knobWrap: {
    flexShrink: 0,
  },
  vuMeter: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    flexShrink: 0,
  },
  vuLabel: {
    fontFamily: 'Share Tech Mono',
    fontSize: '7px',
    color: '#334155',
    letterSpacing: '0.1em',
  },
  vuBars: {
    display: 'flex',
    gap: 2,
    alignItems: 'flex-end',
    height: 20,
  },
  vuBar: {
    width: 4,
    height: 14,
    borderRadius: 1,
    animation: 'waveBar 0.4s ease-in-out infinite alternate',
  },
  favTrayBtn: {
    position: 'relative',
    background: 'transparent',
    border: '1px solid',
    borderRadius: 6,
    padding: '6px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'border-color 0.2s',
  },
  favBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    background: '#ef4444',
    color: '#fff',
    fontFamily: 'Share Tech Mono',
    fontSize: '7px',
    borderRadius: '50%',
    width: 14,
    height: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: 0,
    boxShadow: '0 0 6px rgba(239,68,68,0.6)',
  },
}
