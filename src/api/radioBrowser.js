const BASE_URL = 'https://de1.api.radio-browser.info/json'

const headers = {
  'User-Agent': 'AetherRadio/1.0',
  'Content-Type': 'application/json',
}

export async function getCountries() {
  const res = await fetch(`${BASE_URL}/countries?order=name&hidebroken=true`, { headers })
  return res.json()
}

export async function getLanguages() {
  const res = await fetch(`${BASE_URL}/languages?order=name&hidebroken=true&limit=200`, { headers })
  return res.json()
}

export async function getTags(params = {}) {
  const query = new URLSearchParams({
    order: 'stationcount',
    reverse: 'true',
    hidebroken: 'true',
    limit: '60',
    ...params,
  })
  const res = await fetch(`${BASE_URL}/tags?${query}`, { headers })
  return res.json()
}

export async function searchStations(params = {}) {
  const query = new URLSearchParams({
    order: 'votes',
    reverse: 'true',
    hidebroken: 'true',
    limit: '60',
    ...params,
  })
  const res = await fetch(`${BASE_URL}/stations/search?${query}`, { headers })
  return res.json()
}

export async function getTopStations(limit = 60) {
  const query = new URLSearchParams({
    order: 'votes',
    reverse: 'true',
    hidebroken: 'true',
    limit: String(limit),
  })
  const res = await fetch(`${BASE_URL}/stations/search?${query}`, { headers })
  return res.json()
}

export async function clickStation(stationuuid) {
  try {
    await fetch(`${BASE_URL}/url/${stationuuid}`, { method: 'GET', headers })
  } catch (_) {}
}
