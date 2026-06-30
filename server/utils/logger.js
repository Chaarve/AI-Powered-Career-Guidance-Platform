const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Simple logger implementation
const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${typeof message === 'object' ? JSON.stringify(message) : message}`;
    console.log(logMessage);
    
    // Write to file
    fs.appendFileSync(path.join(logsDir, 'app.log'), logMessage + '\n');
  },

  error: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${typeof message === 'object' ? JSON.stringify(message) : message}`;
    console.error(logMessage);
    
    // Write to error file
    fs.appendFileSync(path.join(logsDir, 'error.log'), logMessage + '\n');
  },

  warn: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${typeof message === 'object' ? JSON.stringify(message) : message}`;
    console.warn(logMessage);
    
    // Write to file
    fs.appendFileSync(path.join(logsDir, 'app.log'), logMessage + '\n');
  },

  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] DEBUG: ${typeof message === 'object' ? JSON.stringify(message) : message}`;
      console.log(logMessage);
      
      // Write to debug file
      fs.appendFileSync(path.join(logsDir, 'debug.log'), logMessage + '\n');
    }
  }
};

module.exports = logger;
