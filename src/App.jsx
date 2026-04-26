import React, { useState } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import TagStrip from './components/TagStrip'
import StationList from './components/StationList'
import Player from './components/Player'
import FrequencyDial from './components/FrequencyDial'
import FavouritesPanel from './components/FavouritesPanel'
import { useRadio } from './hooks/useRadio'
import { useFiltersData } from './hooks/useFiltersData'
import { useBreakpoint } from './hooks/useBreakpoint'
import { useFavourites } from './hooks/useFavourites'
import './App.css'

export default function App() {
  const {
    stations, loading, error,
    currentStation, isPlaying, volume, filters,
    setVolume, playStation, togglePlay, stopStation,
    updateFilter, clearFilters,
  } = useRadio()

  const { countries, languages, availableTags, loadingMeta } = useFiltersData(filters)
  const { favourites, isFavourite, toggleFavourite, clearFavourites } = useFavourites()
  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'
  const isDesktop = bp === 'desktop'

  const [dialOpen, setDialOpen] = useState(true)
  const [favsOpen, setFavsOpen] = useState(false)
  const [mobileDialOpen, setMobileDialOpen] = useState(false)

  const dialSize = isMobile ? 180 : isTablet ? 200 : 240

  return (
    <div style={styles.app}>
      <Header />
      <FilterBar
        filters={filters}
        countries={countries}
        languages={languages}
        onUpdate={updateFilter}
        onClear={clearFilters}
      />
      <TagStrip
        tags={availableTags}
        activeTag={filters.tag}
        onSelect={tag => updateFilter('tag', tag)}
        loading={loadingMeta}
      />

      <div style={styles.body}>
        {/* ── Left: Dial panel (tablet/desktop only) ── */}
        {!isMobile && (
          <div style={{
            ...styles.dialPanel,
            width: dialOpen ? (isTablet ? 240 : 280) : 36,
          }}>
            <button
              style={styles.dialToggle}
              onClick={() => setDialOpen(v => !v)}
              title={dialOpen ? 'Hide dial' : 'Show dial'}
            >
              {dialOpen ? '◀' : '▶'}
            </button>

            {dialOpen && (
              <div style={styles.dialContent}>
                <div style={styles.panelLabel}>
                  <span style={styles.panelLabelText}>FM TUNER</span>
                  <div style={styles.panelLabelLine} />
                </div>

                <FrequencyDial
                  stations={stations}
                  currentStation={currentStation}
                  onSelect={playStation}
                  size={dialSize}
                />

                <div style={styles.readout}>
                  <div style={styles.readoutRow}>
                    <span style={styles.readoutLabel}>STATIONS</span>
                    <span style={styles.readoutValue}>{String(stations.length).padStart(4, '0')}</span>
                  </div>
                  <div style={styles.readoutRow}>
                    <span style={styles.readoutLabel}>STATUS</span>
                    <span style={{ ...styles.readoutValue, color: isPlaying ? '#22c55e' : '#334155' }}>
                      {isPlaying ? 'ON AIR' : 'STANDBY'}
                    </span>
                  </div>
                  {currentStation && (
                    <div style={styles.readoutRow}>
                      <span style={styles.readoutLabel}>NOW</span>
                      <span style={{ ...styles.readoutValue, color: '#ef4444', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentStation.name.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div style={styles.readoutRow}>
                    <span style={styles.readoutLabel}>SAVED</span>
                    <span style={{ ...styles.readoutValue, color: favourites.length > 0 ? '#ef4444' : '#334155' }}>
                      {String(favourites.length).padStart(4, '0')}
                    </span>
                  </div>
                </div>

                <div style={styles.dialHint}>DRAG TO TUNE</div>
              </div>
            )}
          </div>
        )}

        {/* ── Mobile floating buttons ── */}
        {isMobile && (
          <div style={styles.mobileFloatBtns}>
            <button style={styles.mobileFloatBtn} onClick={() => setMobileDialOpen(v => !v)} title="Open tuner">
              📻
            </button>
            <button
              style={{
                ...styles.mobileFloatBtn,
                borderColor: favourites.length > 0 ? '#7f1d1d' : '#334155',
                position: 'relative',
              }}
              onClick={() => setFavsOpen(v => !v)}
              title="Open favourites"
            >
              <svg width="16" height="16" viewBox="0 0 16 16"
                fill={favourites.length > 0 ? '#ef4444' : 'none'}
                stroke={favourites.length > 0 ? '#ef4444' : '#475569'}
                strokeWidth="1.5"
              >
                <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.6 8 3.5C8.8 2.6 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" />
              </svg>
              {favourites.length > 0 && (
                <span style={styles.mobileFloatBadge}>{favourites.length}</span>
              )}
            </button>
          </div>
        )}

        {/* ── Mobile dial modal ── */}
        {isMobile && mobileDialOpen && (
          <div style={styles.mobileOverlay} onClick={() => setMobileDialOpen(false)}>
            <div style={styles.mobileModal} onClick={e => e.stopPropagation()}>
              <div style={styles.mobileModalHeader}>
                <span style={styles.panelLabelText}>FM TUNER</span>
                <button style={styles.mobileModalClose} onClick={() => setMobileDialOpen(false)}>✕</button>
              </div>
              <FrequencyDial
                stations={stations}
                currentStation={currentStation}
                onSelect={(s) => { playStation(s); setMobileDialOpen(false) }}
                size={200}
              />
              <div style={styles.readout}>
                <div style={styles.readoutRow}>
                  <span style={styles.readoutLabel}>STATIONS</span>
                  <span style={styles.readoutValue}>{String(stations.length).padStart(4, '0')}</span>
                </div>
                <div style={styles.readoutRow}>
                  <span style={styles.readoutLabel}>STATUS</span>
                  <span style={{ ...styles.readoutValue, color: isPlaying ? '#22c55e' : '#334155' }}>
                    {isPlaying ? 'ON AIR' : 'STANDBY'}
                  </span>
                </div>
              </div>
              <div style={styles.dialHint}>DRAG TO TUNE</div>
            </div>
          </div>
        )}

        {/* ── Mobile favourites modal ── */}
        {isMobile && favsOpen && (
          <div style={styles.mobileOverlay} onClick={() => setFavsOpen(false)}>
            <div style={{ ...styles.mobileModal, width: '92vw', maxWidth: 380 }} onClick={e => e.stopPropagation()}>
              <FavouritesPanel
                favourites={favourites}
                currentStation={currentStation}
                isFavourite={isFavourite}
                onPlay={(s) => { playStation(s); setFavsOpen(false) }}
                onToggleFav={toggleFavourite}
                onClear={clearFavourites}
                onClose={() => setFavsOpen(false)}
              />
            </div>
          </div>
        )}

        {/* ── Center: Station list ── */}
        <div style={styles.listPanel}>
          <StationList
            stations={stations}
            currentStation={currentStation}
            onPlay={playStation}
            onToggleFav={toggleFavourite}
            isFavourite={isFavourite}
            loading={loading}
            error={error}
          />
        </div>

        {/* ── Right: Favourites panel (tablet/desktop) ── */}
        {!isMobile && favsOpen && (
          <FavouritesPanel
            favourites={favourites}
            currentStation={currentStation}
            isFavourite={isFavourite}
            onPlay={playStation}
            onToggleFav={toggleFavourite}
            onClear={clearFavourites}
            onClose={() => setFavsOpen(false)}
          />
        )}
      </div>

      <Player
        currentStation={currentStation}
        isPlaying={isPlaying}
        volume={volume}
        onToggle={togglePlay}
        onStop={stopStation}
        onVolumeChange={setVolume}
        isFavourite={isFavourite}
        onToggleFav={toggleFavourite}
        favouriteCount={favourites.length}
        onOpenFavourites={() => setFavsOpen(v => !v)}
      />
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#020617',
    overflow: 'hidden',
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  dialPanel: {
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #0a0f1a 0%, #020617 100%)',
    borderRight: '1px solid #1e293b',
    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  },
  dialToggle: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #1e293b',
    color: '#334155',
    fontFamily: 'Share Tech Mono',
    fontSize: '10px',
    padding: '10px 0',
    cursor: 'pointer',
    width: '100%',
    transition: 'color 0.15s',
    flexShrink: 0,
  },
  dialContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 12px',
    gap: 14,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  panelLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  panelLabelText: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '10px',
    color: '#334155',
    letterSpacing: '0.3em',
    fontWeight: 700,
  },
  panelLabelLine: {
    width: '60%',
    height: 1,
    background: 'linear-gradient(90deg, transparent, #1e293b, transparent)',
  },
  readout: {
    width: '100%',
    background: '#020617',
    border: '1px solid #1e293b',
    borderRadius: 4,
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  readoutRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  readoutLabel: {
    fontFamily: 'Share Tech Mono',
    fontSize: '8px',
    color: '#334155',
    letterSpacing: '0.12em',
    flexShrink: 0,
  },
  readoutValue: {
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    color: '#60a5fa',
    letterSpacing: '0.1em',
  },
  dialHint: {
    fontFamily: 'Share Tech Mono',
    fontSize: '8px',
    color: '#1e293b',
    letterSpacing: '0.15em',
  },
  listPanel: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  mobileFloatBtns: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 30,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  mobileFloatBtn: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
    border: '1px solid #334155',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
    position: 'relative',
  },
  mobileFloatBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
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
    boxShadow: '0 0 6px rgba(239,68,68,0.6)',
  },
  mobileOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(2,6,23,0.88)',
    zIndex: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(6px)',
  },
  mobileModal: {
    background: 'linear-gradient(180deg, #0a0f1a 0%, #020617 100%)',
    border: '1px solid #1e293b',
    borderRadius: 14,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
    width: 260,
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 24px 64px rgba(0,0,0,0.85)',
  },
  mobileModalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  mobileModalClose: {
    background: 'transparent',
    border: '1px solid #1e293b',
    borderRadius: 4,
    color: '#475569',
    fontFamily: 'Share Tech Mono',
    fontSize: '10px',
    padding: '4px 8px',
    cursor: 'pointer',
  },
}
