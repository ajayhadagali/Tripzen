const express = require('express');
const mongoose = require('mongoose');
const Itinerary = require('../models/Itinerary');
const auth = require('../middleware/auth');
const tripAccess = require('../middleware/tripAccess');

const router = express.Router();

// GET /api/itinerary/:tripId: all days of a trip
router.get('/:tripId', auth, tripAccess, async (req, res) => {
  try {
    const days = await Itinerary.find({ tripId: req.trip._id }).sort({ createdAt: 1 });
    res.json(days);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/itinerary/:tripId: add a day
router.post('/:tripId', auth, tripAccess, async (req, res) => {
  try {
    const { day } = req.body;
    if (!day || !day.trim())
      return res.status(400).json({ message: 'Day label is required' });

    const created = await Itinerary.create({
      tripId: req.trip._id,
      day: day.trim(),
      activities: [],
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/itinerary/:tripId/:dayId/activities: add an activity to a day
router.post('/:tripId/:dayId/activities', auth, tripAccess, async (req, res) => {
  try {
    const { dayId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(dayId))
      return res.status(400).json({ message: 'Invalid day id' });
    if (!text || !text.trim())
      return res.status(400).json({ message: 'Activity text is required' });

    const updated = await Itinerary.findOneAndUpdate(
      { _id: dayId, tripId: req.trip._id },
      { $push: { activities: text.trim() } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Day not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;