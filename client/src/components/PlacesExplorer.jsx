import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

const label = (s) => (s ? s.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase()) : 'Place');

// Gives up on a request after `ms` so the page never hangs forever
async function fetchWithTimeout(url, options = {}, ms = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function parsePlaces(elements) {
  const seen = new Set();
  return elements
    .filter((e) => e.tags && e.tags.name)
    .map((e) => ({
      id: e.type + e.id,
      name: e.tags.name,
      kind: label(e.tags.tourism || e.tags.historic || e.tags.amenity),
      stars: e.tags.stars,
      address: [e.tags['addr:street'], e.tags['addr:city']].filter(Boolean).join(', '),
      lat: e.lat ?? e.center?.lat,
      lon: e.lon ?? e.center?.lon,
    }))
    .filter((p) => p.lat && p.lon)
    .filter((p) => {
      const key = p.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}

async function runOverpass(query) {
  let lastError;
  for (const url of OVERPASS_URLS) {
    try {
      const res = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'data=' + encodeURIComponent(query),
        },
        15000
      );
      if (!res.ok) throw new Error('Overpass error ' + res.status);
      return await res.json();
    } catch (err) {
      lastError = err; // try the next server
    }
  }
  throw lastError;
}

async function loadPlaces(destination) {
  const cacheKey = 'tripzen_places_' + destination.trim().toLowerCase();
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const geoRes = await fetchWithTimeout(
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
      encodeURIComponent(destination),
    {},
    10000
  );
  const geo = await geoRes.json();
  if (!geo.length) throw new Error('Destination not found');
  const { lat, lon } = geo[0];

  const hotelsQuery = `[out:json][timeout:12];nwr["tourism"~"hotel|guest_house|hostel|resort|apartment"]["name"](around:8000,${lat},${lon});out center 30;`;
  const attractionsQuery = `[out:json][timeout:12];(nwr["tourism"~"attraction|viewpoint|museum|theme_park|zoo"]["name"](around:15000,${lat},${lon});nwr["historic"]["name"](around:15000,${lat},${lon}););out center 30;`;

  const hotelsData = await runOverpass(hotelsQuery);
  const attractionsData = await runOverpass(attractionsQuery);

  const result = {
    hotels: parsePlaces(hotelsData.elements),
    attractions: parsePlaces(attractionsData.elements),
  };
  if (result.hotels.length || result.attractions.length) {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  }
  return result;
}

export default function PlacesExplorer({ destination }) {
  const [tab, setTab] = useState('hotels');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    loadPlaces(destination)
      .then((result) => { if (!cancelled) setData(result); })
      .catch(() => { if (!cancelled) setError('Could not load places right now.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [destination, attempt]);

  const list = data ? data[tab] : [];

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Exploring {destination}</h3>

      <div className="sub-tab-row">
        <button className={tab === 'hotels' ? 'sub-tab active' : 'sub-tab'} onClick={() => setTab('hotels')}>
          Hotels
        </button>
        <button className={tab === 'attractions' ? 'sub-tab active' : 'sub-tab'} onClick={() => setTab('attractions')}>
          Attractions
        </button>
      </div>

      {loading && <p>Finding places near {destination}...</p>}

      {error && (
        <div>
          <p className="error-text">{error}</p>
          <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => setAttempt((a) => a + 1)}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && list.length === 0 && (
        <p>No {tab} found near "{destination}". Try a town or city name, like Panaji or Manali.</p>
      )}

      <div className="place-grid">
        {list.map((p) => (
          <div key={p.id} className="place-tile">
            <span className={tab === 'hotels' ? 'tag' : 'tag teal'}>{p.kind}</span>
            <h4>{p.name}</h4>
            {p.stars && <p className="addr">{p.stars} star</p>}
            {p.address && <p className="addr">{p.address}</p>}
            <a
              className="map-link"
              href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Maps <ExternalLink size={13} />
            </a>
          </div>
        ))}
      </div>

      {data && !loading && (
        <p style={{ marginTop: 18, fontSize: 12 }}>Place data from OpenStreetMap contributors.</p>
      )}
    </div>
  );
}