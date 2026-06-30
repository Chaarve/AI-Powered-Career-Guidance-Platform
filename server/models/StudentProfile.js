const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
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
    enum: ['Science', 'Commerce', 'Arts', 'Vocational'],
    trim: true
  },
  // Enhanced quiz scores
  interests_scores: {
    science: { type: Number, default: 0, min: 0 },
    commerce: { type: Number, default: 0, min: 0 },
    arts: { type: Number, default: 0, min: 0 },
    vocational: { type: Number, default: 0, min: 0 }
  },
  aptitude_scores: {
    science: { type: Number, default: 0, min: 0 },
    commerce: { type: Number, default: 0, min: 0 },
    arts: { type: Number, default: 0, min: 0 },
    vocational: { type: Number, default: 0, min: 0 }
  },
  combined_scores: {
    science: { type: Number, default: 0, min: 0 },
    commerce: { type: Number, default: 0, min: 0 },
    arts: { type: Number, default: 0, min: 0 },
    vocational: { type: Number, default: 0, min: 0 }
  },
  aptitude_accuracy: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  dominant_domain: {
    type: String,
    enum: ['Science', 'Commerce', 'Arts', 'Vocational'],
    default: 'Science'
  },
  // Enhanced quiz completion status
  interests_completed: {
    type: Boolean,
    default: false
  },
  aptitude_completed: {
    type: Boolean,
    default: false
  },
  quiz_completed: {
    type: Boolean,
    default: false
  },
  completion_date: {
    type: Date,
    default: null
  },
  // Quiz answers for both types
  interests_answers: [{
    question_index: Number,
    selected_option: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  aptitude_answers: [{
    question_index: Number,
    selected_option: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  quiz_answers: [{
    question_index: Number,
    selected_option: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // Final recommendations based on combined scores
  final_recommendations: {
    primaryDomain: String,
    scores: {
      science: Number,
      commerce: Number,
      arts: Number,
      vocational: Number
    },
    recommendedCourses: [String],
    explanation: String,
    confidence: Number
  },
  // Quiz history — stores past attempts
  quiz_history: [{
    attempt_number: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    interests_scores: {
      science: Number,
      commerce: Number,
      arts: Number,
      vocational: Number
    },
    aptitude_scores: {
      science: Number,
      commerce: Number,
      arts: Number,
      vocational: Number
    },
    combined_scores: {
      science: Number,
      commerce: Number,
      arts: Number,
      vocational: Number
    },
    correct_answers: Number,
    total_questions: Number,
    dominant_domain: String,
    recommendations: {
      primaryDomain: String,
      recommendedCourses: [String],
      explanation: String
    }
  }],
  career_guidance: {
    streams: [String],
    courses: [String],
    careers: [String],
    explanation: String,
    scores: {
      science: Number,
      commerce: Number,
      arts: Number,
      vocational: Number
    },
    generated_at: {
      type: Date,
      default: null
    }
  },
  academic_details: {
    class_10_marks: Number,
    class_12_marks: Number,
    board: String,
    year_of_passing: Number
  },
  personal_details: {
    date_of_birth: Date,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    city: String,
    state: String,
    country: String,
    phone_number: String,
    parent_name: String,
    parent_occupation: String,
    family_income: String,
    blood_group: String,
    nationality: String,
    languages_known: String,
    hobbies: String,
    strengths: String,
    career_goals: String
  }
}, {
  timestamps: { created_at: 'created_at', updated_at: 'updated_at' }
});

// Method to calculate dominant domain
studentProfileSchema.methods.calculateDominantDomain = function() {
  const scores = this.aptitude_scores;
  const maxScore = Math.max(scores.science, scores.commerce, scores.arts, scores.vocational || 0);
  
  if (maxScore === scores.science) {
    this.dominant_domain = 'Science';
  } else if (maxScore === scores.commerce) {
    this.dominant_domain = 'Commerce';
  } else {
    this.dominant_domain = (maxScore === (scores.vocational || 0)) ? 'Vocational' : 'Arts';
  }
  
  return this.dominant_domain;
};

// Method to normalize aptitude scores
studentProfileSchema.methods.normalizeAptitudeScores = function() {
  const total = this.aptitude_scores.science + 
                this.aptitude_scores.commerce + 
                this.aptitude_scores.arts +
                (this.aptitude_scores.vocational || 0);
  
  if (total === 0) return;
  
  this.aptitude_scores.science = Math.round((this.aptitude_scores.science / total) * 100);
  this.aptitude_scores.commerce = Math.round((this.aptitude_scores.commerce / total) * 100);
  this.aptitude_scores.arts = Math.round((this.aptitude_scores.arts / total) * 100);
  if (typeof this.aptitude_scores.vocational === 'number') {
    this.aptitude_scores.vocational = Math.round((this.aptitude_scores.vocational / total) * 100);
  }
};

// Indexes for faster queries
studentProfileSchema.index({ userId: 1 });
studentProfileSchema.index({ marks: 1, declared_interest: 1 });
studentProfileSchema.index({ dominant_domain: 1 });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
