import React, { useState } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import TagStrip from './components/TagStrip'
import StationList from './components/StationList'
import Player from './components/Player'
import FrequencyDial from './components/FrequencyDial'
import { useRadio } from './hooks/useRadio'
import { useFiltersData } from './hooks/useFiltersData'
import './App.css'

export default function App() {
  const {
    stations, loading, error,
    currentStation, isPlaying, volume, filters,
    setVolume, playStation, togglePlay, stopStation,
    updateFilter, clearFilters,
  } = useRadio()

  const { countries, languages, availableTags, loadingMeta } = useFiltersData(filters)
  const [dialOpen, setDialOpen] = useState(false)

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
        {/* Dial panel */}
        <div style={{ ...styles.dialPanel, ...(dialOpen ? styles.dialPanelOpen : {}) }}>
          <button style={styles.dialToggle} onClick={() => setDialOpen(v => !v)}>
            {dialOpen ? '◀ HIDE DIAL' : '▶ DIAL'}
          </button>
          {dialOpen && (
            <div style={styles.dialContent}>
              <FrequencyDial
                stations={stations}
                currentStation={currentStation}
                onSelect={playStation}
              />
              <div style={styles.dialInfo}>
                <span style={styles.dialInfoText}>
                  {stations.length} STATIONS
                </span>
                <span style={styles.dialInfoText}>
                  DRAG TO TUNE
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Station list */}
        <div style={styles.listPanel}>
          <StationList
            stations={stations}
            currentStation={currentStation}
            onPlay={playStation}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      <Player
        currentStation={currentStation}
        isPlaying={isPlaying}
        volume={volume}
        onToggle={togglePlay}
        onStop={stopStation}
        onVolumeChange={setVolume}
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
  },
  dialPanel: {
    display: 'flex',
    flexDirection: 'column',
    background: '#0a0f1a',
    borderRight: '1px solid #1e293b',
    transition: 'width 0.3s ease',
    width: 40,
    overflow: 'hidden',
    flexShrink: 0,
  },
  dialPanelOpen: {
    width: 280,
  },
  dialToggle: {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #1e293b',
    color: '#334155',
    fontFamily: 'Share Tech Mono',
    fontSize: '8px',
    letterSpacing: '0.1em',
    padding: '10px 6px',
    cursor: 'pointer',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    alignSelf: 'stretch',
    transition: 'color 0.15s',
    whiteSpace: 'nowrap',
  },
  dialContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 16px',
    gap: 16,},
  dialInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  dialInfoText: {
    fontFamily: 'Share Tech Mono',
    fontSize: '9px',
    color: '#334155',
    letterSpacing: '0.12em',
  },
  listPanel: {
    flex: 1,
    overflowY: 'auto',
  },
}
