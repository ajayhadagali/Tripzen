const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0.01 },
  paidBy: { type: String, required: true },
  splitAmong: [{ type: String, required: true }],
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);