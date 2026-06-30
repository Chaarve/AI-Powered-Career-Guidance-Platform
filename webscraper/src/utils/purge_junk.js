require('dotenv').config();
const mongoose = require('mongoose');

async function purge() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not found in environment');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    const junkFilter = {
      $or: [
        { name: /Indian Institute of Excellence/i },
        { slug: { $exists: false } },
        { slug: null },
        { district: 'District_1' } // Another hallmark of the mock data I found
      ]
    };

    const countBefore = await mongoose.connection.db.collection('colleges').countDocuments(junkFilter);
    console.log(`Found ${countBefore} suspicious records.`);

    if (countBefore > 0) {
      const result = await mongoose.connection.db.collection('colleges').deleteMany(junkFilter);
      console.log(`Successfully deleted ${result.deletedCount} records.`);
    } else {
      console.log('No junk records found to delete.');
    }

    const totalRemaining = await mongoose.connection.db.collection('colleges').countDocuments({});
    console.log(`Total real colleges remaining: ${totalRemaining}`);

    // Show a sample of what's left
    const sample = await mongoose.connection.db.collection('colleges').find({}).limit(5).toArray();
    console.log('\nSample of remaining authentic data:');
    sample.forEach(c => console.log(` - ${c.name} (${c.location?.state || 'Unknown state'})`));

  } catch (err) {
    console.error('Cleanup failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

purge();
