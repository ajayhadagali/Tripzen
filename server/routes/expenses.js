const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const tripAccess = require('../middleware/tripAccess');
const { calculateNetBalances, simplifyDebts } = require('../utils/settle');

const router = express.Router();

// GET /api/expenses/:tripId/settlement: runs the algorithm
router.get('/:tripId/settlement', auth, tripAccess, async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.trip._id });
    const balances = calculateNetBalances(expenses, req.trip.members);
    const transactions = simplifyDebts(balances);
    res.json({ balances, transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/expenses/:tripId: all expenses of a trip
router.get('/:tripId', auth, tripAccess, async (req, res) => {
  try {
    const expenses = await Expense.find({ tripId: req.trip._id }).sort({ createdAt: 1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/expenses/:tripId: add an expense
router.post('/:tripId', auth, tripAccess, async (req, res) => {
  try {
    const { title, amount, paidBy, splitAmong } = req.body;
    const members = req.trip.members;

    if (!title || !amount || !paidBy || !splitAmong || !splitAmong.length)
      return res.status(400).json({ message: 'All fields are required' });
    if (Number(amount) <= 0)
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    if (!members.includes(paidBy))
      return res.status(400).json({ message: 'Payer is not a trip member' });
    if (!splitAmong.every((m) => members.includes(m)))
      return res.status(400).json({ message: 'Split includes someone who is not a trip member' });

    const expense = await Expense.create({
      tripId: req.trip._id,
      title,
      amount: Number(amount),
      paidBy,
      splitAmong,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;