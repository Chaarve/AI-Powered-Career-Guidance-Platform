const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: [true, 'College ID is required']
  },
  added_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Unique compound index — a user can wishlist a college only once
wishlistSchema.index({ userId: 1, collegeId: 1 }, { unique: true });
wishlistSchema.index({ userId: 1 });

// Static: get all wishlisted colleges for a user
wishlistSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ added_at: -1 });
};

module.exports = mongoose.model('Wishlist', wishlistSchema);
