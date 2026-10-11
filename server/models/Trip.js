const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  dates: { type: String, default: 'Dates TBD' },
  members: [{ type: String, required: true }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);