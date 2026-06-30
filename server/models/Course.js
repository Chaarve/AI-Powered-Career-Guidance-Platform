const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [200, 'Course name cannot exceed 200 characters']
  },
  stream: {
    type: String,
    required: [true, 'Stream is required'],
    enum: ['Science', 'Commerce', 'Arts'],
    trim: true
  },
  min_marks: {
    type: Number,
    required: [true, 'Minimum marks are required'],
    min: [0, 'Minimum marks cannot be negative'],
    max: [100, 'Minimum marks cannot exceed 100']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  career_paths: [{
    type: String,
    trim: true
  }],
  duration_years: {
    type: Number,
    default: 3,
    min: 1,
    max: 6
  },
  source: {
    type: String,
    enum: ['manual', 'scraped'],
    default: 'manual'
  },
  scraped_url: {
    type: String,
    default: null
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { created_at: 'created_at', updated_at: 'updated_at' }
});

// Indexes for faster queries
courseSchema.index({ stream: 1, min_marks: 1 });
courseSchema.index({ is_active: 1 });
courseSchema.index({ source: 1 });

// Static method to find eligible courses
courseSchema.statics.findEligible = function(marks, streams) {
  return this.find({
    is_active: true,
    min_marks: { $lte: marks },
    stream: { $in: streams }
  }).sort({ min_marks: -1 });
};

module.exports = mongoose.model('Course', courseSchema);
