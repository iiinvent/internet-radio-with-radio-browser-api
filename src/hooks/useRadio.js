import { useState, useEffect, useRef } from 'react'
import { searchStations, clickStation } from '../api/radioBrowser'

const INITIAL_FILTERS = {
  country: '',
  language: '',
  tag: '',
  bitrate: '',
  codec: '',
}

export function useRadio() {
  const [stations, setStations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentStation, setCurrentStation] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  const audioRef = useRef(null)
  const playLockRef = useRef(false)

  // Fetch stations when filters change
  useEffect(() => {
    async function fetchStations() {
      setLoading(true)
      setError(null)
      try {
        const params = {}
        // countrycode expects ISO 3166-1 alpha-2 (e.g. "US", "GB")
        if (filters.country) params.countrycode = filters.country
        // language expects the language name in lowercase (e.g. "english")
        if (filters.language) params.language = filters.language.toLowerCase()
        // tag
        if (filters.tag) params.tag = filters.tag
        // bitrateMin
        if (filters.bitrate) params.bitratemin = filters.bitrate
        // codec expects uppercase (e.g. "MP3", "AAC")
        if (filters.codec) params.codec = filters.codec

        const data = await searchStations(params)

        // Sort by votes (popularity) in descending order
        const sorted = (Array.isArray(data) ? data : []).sort((a, b) => {
          const votesA = parseInt(a.votes) || 0
          const votesB = parseInt(b.votes) || 0
          return votesB - votesA
        })

        setStations(sorted)
      } catch (err) {
        setError(err.message)
        setStations([])
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [filters])

  function playStation(station) {
    if (playLockRef.current) return
    playLockRef.current = true

    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }

      setCurrentStation(station)
      setIsPlaying(true)

      const audio = new Audio()
      audio.volume = volume
      audio.src = station.url
      audioRef.current = audio

      audio.play().catch(err => {
        console.error('Playback error:', err)
        setIsPlaying(false)
      })

      clickStation(station.stationuuid)
    } finally {
      playLockRef.current = false
    }
  }

  function togglePlay() {
    if (!audioRef.current || !currentStation) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(err => {
        console.error('Playback error:', err)
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  function stopStation() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    setCurrentStation(null)
    setIsPlaying(false)
  }

  function updateFilter(key, value) {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS)
    stopStation()
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

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
    stopStation,
    updateFilter,
    clearFilters,
  }
}
