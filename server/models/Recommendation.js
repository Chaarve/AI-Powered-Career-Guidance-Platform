const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student ID is required']
  },
  recommended_courses: [{
    course_name: {
      type: String,
      required: true
    },
    course_level: { type: String },
    course_duration: { type: String },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      maxlength: [500, 'Reason cannot exceed 500 characters']
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    rank: {
      type: Number,
      min: 1
    }
  }],
  aptitude_profile: {
    science: Number,
    commerce: Number,
    arts: Number,
    dominant_domain: String
  },
  student_profile: {
    marks: Number,
    declared_interest: String
  },
  recommendation_type: {
    type: String,
    enum: ['hybrid', 'rule_based', 'llm_only'],
    default: 'hybrid'
  },
  llm_response: {
    raw_response: String,
    processing_time: Number,
    success: Boolean,
    error_message: String
  },
  total_courses_filtered: {
    type: Number,
    default: 0
  },
  total_courses_recommended: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { created_at: 'created_at', updated_at: 'updated_at' }
});

// Indexes for faster queries
recommendationSchema.index({ student_id: 1 });
recommendationSchema.index({ created_at: -1 });

// Static method to find recommendations by student
recommendationSchema.statics.findByStudent = function(studentId) {
  return this.find({ student_id: studentId })
    .sort({ created_at: -1 });
};

// Static method to find latest recommendation for student
recommendationSchema.statics.findLatestByStudent = function(studentId) {
  return this.findOne({ student_id: studentId })
    .sort({ created_at: -1 });
};

module.exports = mongoose.model('Recommendation', recommendationSchema);
