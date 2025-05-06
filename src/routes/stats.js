const express = require('express');
const router = express.Router();
const { getVisitorStats, resetVisitorStats } = require('../middleware/visitorCounter');
const fs = require('fs');
const path = require('path');

// Path to visitor data file
const counterFilePath = path.join(__dirname, '../data/visitors.json');

// Get visitor statistics
router.get('/', (req, res) => {
  try {
    // Check if raw data is requested (for admin view)
    if (req.query.raw === 'true') {
      // Read the raw visitor data file directly
      if (fs.existsSync(counterFilePath)) {
        const rawData = JSON.parse(fs.readFileSync(counterFilePath, 'utf8'));
        
        res.json({
          status: 'success',
          data: {
            totalVisits: rawData.totalCount,
            uniqueVisitors: Object.keys(rawData.uniqueIPs).length,
            lastReset: rawData.lastReset,
            ipData: rawData.uniqueIPs
          }
        });
      } else {
        res.json({
          status: 'success',
          data: {
            totalVisits: 0,
            uniqueVisitors: 0,
            lastReset: new Date().toISOString(),
            ipData: {}
          }
        });
      }
    } else {
      // Return standard stats summary
      const stats = getVisitorStats();
      res.json({
        status: 'success',
        data: stats
      });
    }
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve visitor statistics'
    });
  }
});

// Reset visitor statistics (restricted to admin use or remove if not needed)
router.post('/reset', (req, res) => {
  // Add authentication if needed
  const success = resetVisitorStats();
  if (success) {
    res.json({
      status: 'success',
      message: 'Visitor statistics reset successfully'
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Failed to reset visitor statistics'
    });
  }
});

module.exports = router; 