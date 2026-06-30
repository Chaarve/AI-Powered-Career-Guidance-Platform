'use strict';
const mongoose = require('mongoose');

// ─── Course Sub-Schema ────────────────────────────────────────────────────────
const CourseSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  level:    { type: String, enum: ['UG', 'PG', 'Diploma', 'Certificate', 'PhD', 'Other'], default: 'Other' },
  duration: { type: String },
  fees:     { type: Number },          // Annual fees in INR
  feesRaw:  { type: String },          // Original text e.g. "₹1.2 Lacs"
  mode:     { type: String },          // Full Time | Part Time | Distance
  specialization: { type: String },
}, { _id: false });

// ─── Location Sub-Schema ──────────────────────────────────────────────────────
const LocationSchema = new mongoose.Schema({
  city:  { type: String },
  state: { type: String },
  pincode: { type: String },
}, { _id: false });

// ─── Fee Range Sub-Schema ─────────────────────────────────────────────────────
const FeeRangeSchema = new mongoose.Schema({
  min: { type: Number },
  max: { type: Number },
  raw: { type: String },     // Original text like "20,000 - 3,18,000"
}, { _id: false });

// ─── Main College Schema ──────────────────────────────────────────────────────
const CollegeSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, index: true },
    slug:           { type: String, unique: true, sparse: true },
    location:       { type: LocationSchema },
    type:           { type: String },      // Government | Private | Public | Private Unaided
    rating:         { type: Number },
    reviews:        { type: Number },
    accreditations: [{ type: String }],   // UGC, NAAC, AICTE, NBA …
    feeRange:       { type: FeeRangeSchema },
    avgPackage:     { type: String },
    nirfRank:       { type: Number },
    entranceExams:  [{ type: String }],
    courses:        [CourseSchema],
    shortlistedBy:  { type: Number },
    totalCourses:   { type: Number },
    sourceUrl:      { type: String },
    scrapedAt:      { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'colleges',
  }
);

// Indexes for fast queries by state, course, fee
CollegeSchema.index({ 'location.state': 1 });
CollegeSchema.index({ 'feeRange.min': 1, 'feeRange.max': 1 });
CollegeSchema.index({ 'courses.name': 1 });
CollegeSchema.index({ nirfRank: 1 });

const College = mongoose.model('College', CollegeSchema);
module.exports = College;
