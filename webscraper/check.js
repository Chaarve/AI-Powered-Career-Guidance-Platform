require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const count = await mongoose.connection.db.collection('colleges').countDocuments();
  const states = await mongoose.connection.db.collection('colleges').aggregate([
    { $group: { _id: '$location.state', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]).toArray();
  const withCourses = await mongoose.connection.db.collection('colleges').countDocuments({ 'courses.0': { $exists: true } });
  console.log('Total colleges in DB:', count);
  console.log('With courses:', withCourses);
  console.log('\nTop states:');
  states.forEach(s => console.log(' ', (s._id || 'Unknown').padEnd(25), ':', s.count));
  mongoose.disconnect();
});
