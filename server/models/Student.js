const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: [0, 'Marks cannot be negative'],
    max: [100, 'Marks cannot exceed 100']
  },
  declared_interest: {
    type: String,
    required: [true, 'Declared interest is required'],
    enum: ['Science', 'Commerce', 'Arts'],
    trim: true
  },
  aptitude_scores: {
    science: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    commerce: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    arts: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  dominant_domain: {
    type: String,
    enum: ['Science', 'Commerce', 'Arts'],
    default: null
  },
  quiz_completed: {
    type: Boolean,
    default: false
  },
  quiz_answers: [{
    question_index: Number,
    selected_option: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: { created_at: 'created_at', updated_at: 'updated_at' }
});

// Index for faster queries
studentSchema.index({ marks: 1, declared_interest: 1 });
studentSchema.index({ dominant_domain: 1 });

// Method to calculate dominant domain
studentSchema.methods.calculateDominantDomain = function() {
  const scores = this.aptitude_scores;
  const maxScore = Math.max(scores.science, scores.commerce, scores.arts);
  
  if (maxScore === scores.science) {
    this.dominant_domain = 'Science';
  } else if (maxScore === scores.commerce) {
    this.dominant_domain = 'Commerce';
  } else {
    this.dominant_domain = 'Arts';
  }
  
  return this.dominant_domain;
};

// Method to normalize aptitude scores
studentSchema.methods.normalizeAptitudeScores = function() {
  const total = this.aptitude_scores.science + 
                this.aptitude_scores.commerce + 
                this.aptitude_scores.arts;
  
  if (total === 0) return;
  
  this.aptitude_scores.science = Math.round((this.aptitude_scores.science / total) * 100);
  this.aptitude_scores.commerce = Math.round((this.aptitude_scores.commerce / total) * 100);
  this.aptitude_scores.arts = Math.round((this.aptitude_scores.arts / total) * 100);
};

module.exports = mongoose.model('Student', studentSchema);
