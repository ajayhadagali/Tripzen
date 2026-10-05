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
const EXPENSE_KEY = 'tripzen_expenses';

const seedExpenses = {
  '1': [
    { id: 'e1', title: 'Hotel booking', amount: 4000, paidBy: 'Alice', splitAmong: ['Alice', 'Bob', 'Carol', 'Dave'] },
    { id: 'e2', title: 'Dinner', amount: 1200, paidBy: 'Bob', splitAmong: ['Alice', 'Bob', 'Carol', 'Dave'] },
    { id: 'e3', title: 'Cab', amount: 800, paidBy: 'Carol', splitAmong: ['Carol', 'Dave'] },
  ],
};

function getAllExpenses() {
  const raw = localStorage.getItem(EXPENSE_KEY);
  if (!raw) {
    localStorage.setItem(EXPENSE_KEY, JSON.stringify(seedExpenses));
    return seedExpenses;
  }
  return JSON.parse(raw);
}

export function getExpenses(tripId) {
  const all = getAllExpenses();
  return all[tripId] || [];
}

export function addExpense(tripId, expense) {
  const all = getAllExpenses();
  const newExpense = { ...expense, id: 'e' + Date.now() };
  const existing = all[tripId] || [];
  all[tripId] = [...existing, newExpense];
  localStorage.setItem(EXPENSE_KEY, JSON.stringify(all));
  return newExpense;
}