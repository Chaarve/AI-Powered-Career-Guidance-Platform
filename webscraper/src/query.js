'use strict';
/**
 * query.js — Query college data stored in MongoDB
 * Usage examples:
 *   node src/query.js                          → Summary stats
 *   node src/query.js --state "Tamil Nadu"     → Colleges in Tamil Nadu
 *   node src/query.js --course "B.Tech"        → Colleges offering B.Tech
 *   node src/query.js --fee-max 100000         → Colleges with fees below ₹1 Lakh
 *   node src/query.js --state "Karnataka" --course "MBA"
 */
require('dotenv').config();
const mongoose = require('mongoose');
const College  = require('./models/College');
const { connect, disconnect } = require('./db');

async function printSummary() {
  const total   = await College.countDocuments();
  const states  = await College.distinct('location.state');
  const types   = await College.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $sort:  { count: -1 } },
  ]);

  console.log('\n╔══════════════════════════════════╗');
  console.log('║        MongoDB Summary            ║');
  console.log('╚══════════════════════════════════╝');
  console.log(`  Total colleges  : ${total}`);
  console.log(`  States covered  : ${states.length}`);
  console.log('\n  By type:');
  types.forEach(t => console.log(`    ${(t._id || 'Unknown').padEnd(20)} : ${t.count}`));

  // Top 5 states
  const topStates = await College.aggregate([
    { $group: { _id: '$location.state', count: { $sum: 1 } } },
    { $sort:  { count: -1 } },
    { $limit: 10 },
  ]);
  console.log('\n  Top states:');
  topStates.forEach(s => console.log(`    ${(s._id || 'Unknown').padEnd(25)} : ${s.count}`));

  // Fee distribution
  const feeStats = await College.aggregate([
    { $match: { 'feeRange.min': { $gt: 0 } } },
    { $group: {
      _id:    null,
      avgMin: { $avg: '$feeRange.min' },
      avgMax: { $avg: '$feeRange.max' },
      minFee: { $min: '$feeRange.min' },
      maxFee: { $max: '$feeRange.max' },
    }},
  ]);
  if (feeStats.length) {
    const f = feeStats[0];
    console.log('\n  Fee statistics (INR):');
    console.log(`    Lowest fee  : ₹${f.minFee?.toLocaleString('en-IN')}`);
    console.log(`    Highest fee : ₹${f.maxFee?.toLocaleString('en-IN')}`);
    console.log(`    Avg min fee : ₹${Math.round(f.avgMin)?.toLocaleString('en-IN')}`);
  }
  console.log();
}

async function queryColleges({ state, course, feeMax, feeMin, limit = 20 }) {
  const filter = {};
  if (state)   filter['location.state'] = new RegExp(state, 'i');
  if (course)  filter['courses.name']   = new RegExp(course, 'i');
  if (feeMax)  filter['feeRange.max']   = { $lte: parseInt(feeMax, 10) };
  if (feeMin)  filter['feeRange.min']   = { $gte: parseInt(feeMin, 10) };

  const colleges = await College.find(filter)
    .sort({ nirfRank: 1, rating: -1 })
    .limit(limit)
    .select('name location type feeRange avgPackage nirfRank courses rating totalCourses');

  console.log(`\n📊  Found ${colleges.length} colleges:\n`);
  for (const c of colleges) {
    console.log(`  🏫  ${c.name}`);
    console.log(`      State     : ${c.location?.state || 'N/A'} | City: ${c.location?.city || 'N/A'}`);
    console.log(`      Type      : ${c.type || 'N/A'}`);
    console.log(`      Fee Range : ₹${(c.feeRange?.min || 0).toLocaleString('en-IN')} – ₹${(c.feeRange?.max || 0).toLocaleString('en-IN')}`);
    console.log(`      Avg Pkg   : ${c.avgPackage || 'N/A'}`);
    console.log(`      NIRF Rank : ${c.nirfRank || 'N/A'} | Rating: ${c.rating || 'N/A'}`);

    if (course && c.courses?.length) {
      const matched = c.courses.filter(cr => new RegExp(course, 'i').test(cr.name));
      if (matched.length) {
        console.log(`      Matching courses:`);
        matched.slice(0, 5).forEach(cr => {
          console.log(`        → ${cr.name} | ${cr.duration || 'N/A'} | ₹${(cr.fees || 0).toLocaleString('en-IN') || 'N/A'}`);
        });
      }
    }
    console.log();
  }
}

// ─── Parse CLI args ──────────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--state')    result.state   = args[++i];
    if (args[i] === '--course')   result.course  = args[++i];
    if (args[i] === '--fee-max')  result.feeMax  = args[++i];
    if (args[i] === '--fee-min')  result.feeMin  = args[++i];
    if (args[i] === '--limit')    result.limit   = parseInt(args[++i], 10);
  }
  return result;
}

async function main() {
  await connect();
  const args = parseArgs();
  const hasFilter = args.state || args.course || args.feeMax || args.feeMin;

  if (hasFilter) {
    await queryColleges(args);
  } else {
    await printSummary();
  }

  await disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
