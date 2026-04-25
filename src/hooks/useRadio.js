import { useState, useEffect, useRef } from 'react'
import { searchStations, getTopStations, clickStation } from '../api/radioBrowser'

export function useRadio() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentStation, setCurrentStation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [filters, setFilters] = useState({
    country: '',
    language: '',
    tag: '',
    bitrateMin: '',
    codec: '',
  })
  const audioRef = useRef(null)
  const abortRef = useRef(null)
  const playingStationRef = useRef(null)
  const playLockRef = useRef(false)

  useEffect(() => {
    fetchStations()
  }, [filters])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  async function fetchStations() {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (filters.country) params.countrycode = filters.country
      if (filters.language) params.language = filters.language
      if (filters.tag) params.tag = filters.tag
      if (filters.bitrateMin) params.bitrateMin = filters.bitrateMin
      if (filters.codec) params.codec = filters.codec

      const hasFilters = Object.values(params).some(Boolean)
      const data = hasFilters ? await searchStations(params) : await getTopStations(60)
      setStations(data)
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function playStation(station) {
    if (!station?.url_resolved) return

    // Lock to prevent concurrent plays
    if (playLockRef.current) return
    playLockRef.current = true

    // Don't play if already playing this station
    if (playingStationRef.current?.stationuuid === station.stationuuid) {
      playLockRef.current = false
      return
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ''
    }

    playingStationRef.current = station
    setCurrentStation(station)

    const audio = new Audio(station.url_resolved)
    audio.volume = volume
    audioRef.current = audio

    audio.play()
      .then(() => {
        setIsPlaying(true)
        clickStation(station.stationuuid)
        playLockRef.current = false
      })
      .catch(() => {
        // Fallback to non-resolved URL
        const fallback = new Audio(station.url)
        fallback.volume = volume
        audioRef.current = fallback

        fallback.play()
          .then(() => {
            setIsPlaying(true)
            clickStation(station.stationuuid)
            playLockRef.current = false
          })
          .catch(() => {
            setIsPlaying(false)
            playingStationRef.current = null
            playLockRef.current = false
          })

        fallback.onended = () => {
          setIsPlaying(false)
          playingStationRef.current = null
        }
        fallback.onerror = () => {
          setIsPlaying(false)
          playingStationRef.current = null
        }
      })

    audio.onended = () => {
      setIsPlaying(false)
      playingStationRef.current = null
    }
    audio.onerror = () => {
      setIsPlaying(false)
      playingStationRef.current = null
    }
  }

  function togglePlay() {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  function updateFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters({ country: '', language: '', tag: '', bitrateMin: '', codec: '' })
  }

  return {
    stations,
    loading,
    error,
    currentStation,
    isPlaying,
    volume,
    filters,
    setVolume,
    playStation,
    togglePlay,
    updateFilter,
    clearFilters,
    refetch: fetchStations,
  }
}
