const express = require('express');
const Trip = require('../models/Trip');
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
router.post('/', auth, async (req, res) => {
  try {
    const { name, destination, dates, members } = req.body;
    if (!name || !destination)
      return res.status(400).json({ message: 'Name and destination are required' });

    const trip = await Trip.create({
      name,
      destination,
      dates: dates || 'Dates TBD',
      members: members && members.length ? members : ['You'],
      createdBy: req.userId,
    });
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;