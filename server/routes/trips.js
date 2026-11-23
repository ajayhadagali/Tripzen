const express = require('express');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const Itinerary = require('../models/Itinerary');
const auth = require('../middleware/auth');
const tripAccess = require('../middleware/tripAccess');

const router = express.Router();

// GET /api/trips: all trips of the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find({ createdBy: req.userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trips/:tripId
router.get('/:tripId', auth, tripAccess, (req, res) => {
  res.json(req.trip);
});

// POST /api/trips
// POST /api/trips
router.post('/', auth, async (req, res) => {
  try {
    const { name, destination, startDate, endDate, members } = req.body;
    if (!name || !destination)
      return res.status(400).json({ message: 'Name and destination are required' });

    let dates = 'Dates TBD';
    if (startDate || endDate) {
      if (!startDate || !endDate)
        return res.status(400).json({ message: 'Enter both a start date and an end date, or leave both empty' });

      const isoDate = /^\d{4}-\d{2}-\d{2}$/;
      if (!isoDate.test(startDate) || !isoDate.test(endDate))
        return res.status(400).json({ message: 'Dates must be valid calendar dates' });

      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime()))
        return res.status(400).json({ message: 'Dates must be valid calendar dates' });
      if (end < start)
        return res.status(400).json({ message: 'End date cannot be before the start date' });

      dates = `${startDate} to ${endDate}`;
    }

    const trip = await Trip.create({
      name,
      destination,
      dates,
      members: members && members.length ? members : ['You'],
      createdBy: req.userId,
    });
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/trips/:tripId: removes the trip and everything inside it
router.delete('/:tripId', auth, tripAccess, async (req, res) => {
  try {
    await Expense.deleteMany({ tripId: req.trip._id });
    await Itinerary.deleteMany({ tripId: req.trip._id });
    await req.trip.deleteOne();
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;