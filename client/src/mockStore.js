const STORAGE_KEY = 'tripzen_trips';

const seedTrips = [
  { id: '1', name: 'Goa Trip', destination: 'Goa', dates: '12-15 Dec', members: ['Alice', 'Bob', 'Carol', 'Dave'] },
  { id: '2', name: 'Manali Trek', destination: 'Manali', dates: '20-25 Dec', members: ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'] },
];

export function getTrips() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTrips));
    return seedTrips;
  }
  return JSON.parse(raw);
}

export function getTripById(id) {
  return getTrips().find((t) => String(t.id) === String(id));
}

export function addTrip(trip) {
  const trips = getTrips();
  const newTrip = { ...trip, id: Date.now().toString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...trips, newTrip]));
  return newTrip;
}