const express = require('express');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');

// Get last 10 searches
router.get('/', async (req, res) => {
  try {
    const history = await SearchHistory
      .find()
      .sort({ searchedAt: -1 })
      .limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch history' });
  }
});

module.exports = router;