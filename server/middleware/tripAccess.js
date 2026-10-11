const mongoose = require('mongoose');
const Trip = require('../models/Trip');

module.exports = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    if (!mongoose.isValidObjectId(tripId))
      return res.status(400).json({ message: 'Invalid trip id' });

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (String(trip.createdBy) !== String(req.userId))
      return res.status(403).json({ message: 'Not your trip' });

    req.trip = trip;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};