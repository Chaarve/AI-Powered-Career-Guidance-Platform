'use strict';
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/collegedekho';

let isConnected = false;

async function connect() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`✅  MongoDB connected → ${MONGO_URI}`);
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

async function disconnect() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('🔌  MongoDB disconnected');
}

module.exports = { connect, disconnect };

// Quick test when run directly
if (require.main === module) {
  (async () => {
    await connect();
    console.log('DB test OK!');
    await disconnect();
  })();
}
