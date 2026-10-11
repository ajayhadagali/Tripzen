const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  day: { type: String, required: true, trim: true },
  activities: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);