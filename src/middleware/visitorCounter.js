const fs = require('fs');
const path = require('path');

// Path to store visitor count data
const counterFilePath = path.join(__dirname, '../data/visitors.json');

// Initialize visitor data structure
const initVisitorData = {
  totalCount: 0,
  uniqueIPs: {},
  lastReset: new Date().toISOString()
};

// Ensure the data file exists
const ensureCounterFile = () => {
  try {
    if (!fs.existsSync(counterFilePath)) {
      // Create the directory if it doesn't exist
      const dir = path.dirname(counterFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Write initial data
      fs.writeFileSync(counterFilePath, JSON.stringify(initVisitorData, null, 2));
      return initVisitorData;
    }
    
    // Read existing data
    const data = JSON.parse(fs.readFileSync(counterFilePath, 'utf8'));
    return data;
  } catch (error) {
    console.error('Error initializing visitor counter:', error);
    return initVisitorData;
  }
};

// Middleware to count visitors
const visitorCounter = (req, res, next) => {
  try {
    // Skip counting for resource files and API docs
    const skipPaths = ['/favicon', '.css', '.js', '.png', '.jpg', '.ico', '/api-docs'];
    const shouldSkip = skipPaths.some(path => req.path.includes(path));
    
    if (!shouldSkip) {
      const visitorData = ensureCounterFile();
      
      // Increment total visitor count
      visitorData.totalCount += 1;
      
      // Track unique IPs
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      if (!visitorData.uniqueIPs[ip]) {
        visitorData.uniqueIPs[ip] = 0;
      }
      visitorData.uniqueIPs[ip] += 1;
      
      // Save updated count
      fs.writeFileSync(counterFilePath, JSON.stringify(visitorData, null, 2));
    }
  } catch (error) {
    console.error('Error counting visitor:', error);
  }
  
  next();
};

// Function to get visitor stats
const getVisitorStats = () => {
  try {
    const visitorData = ensureCounterFile();
    return {
      totalVisits: visitorData.totalCount,
      uniqueVisitors: Object.keys(visitorData.uniqueIPs).length,
      lastReset: visitorData.lastReset
    };
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      lastReset: new Date().toISOString()
    };
  }
};

// Function to reset visitor stats
const resetVisitorStats = () => {
  try {
    const resetData = {
      totalCount: 0,
      uniqueIPs: {},
      lastReset: new Date().toISOString()
    };
    
    fs.writeFileSync(counterFilePath, JSON.stringify(resetData, null, 2));
    return true;
  } catch (error) {
    console.error('Error resetting visitor stats:', error);
    return false;
  }
};

module.exports = {
  visitorCounter,
  getVisitorStats,
  resetVisitorStats
}; 