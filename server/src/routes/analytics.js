const express = require('express');
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

// GET /api/analytics/trends?groupBy=day&from=YYYY-MM-DD&to=YYYY-MM-DD&category=Roads
router.get('/trends', auth, requireRole('admin'), async (req, res) => {
  try {
    const { from, to, groupBy = 'day', category, town } = req.query;

    const match = {};
    if (from) match.createdAt = { $gte: new Date(from) };
    if (to) match.createdAt = match.createdAt || {};
    if (to) match.createdAt.$lte = new Date(to);
    if (category) match.category = category;
    if (town) match.town = town;

    const dateTrunc = (() => {
      switch (groupBy) {
        case 'month':
          return { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        case 'day':
        default:
          return { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      }
    })();

    const pipeline = [
      { $match: match },
      { $group: { _id: dateTrunc, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ];

    const result = await Complaint.aggregate(pipeline);
    return res.json(result);
  } catch (err) {
    console.error('Analytics /trends error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/analytics/top-areas?from=...&to=...&limit=20
router.get('/top-areas', auth, requireRole('admin'), async (req, res) => {
  try {
    const { from, to, limit = 20 } = req.query;
    const match = {};
    if (from) match.createdAt = { $gte: new Date(from) };
    if (to) match.createdAt = match.createdAt || {};
    if (to) match.createdAt.$lte = new Date(to);

    const pipeline = [
      { $match: match },
      { $group: { _id: '$town', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number(limit) },
    ];

    const result = await Complaint.aggregate(pipeline);
    return res.json(result);
  } catch (err) {
    console.error('Analytics /top-areas error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
