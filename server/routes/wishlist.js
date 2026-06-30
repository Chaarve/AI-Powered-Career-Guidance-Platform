const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
  getWishlistIds
} = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

// GET /api/wishlist - Get user's full wishlist
router.get('/', authenticate, getWishlist);

// GET /api/wishlist/ids - Get just the IDs (for batch checking)
router.get('/ids', authenticate, getWishlistIds);

// GET /api/wishlist/check/:collegeId - Check if a college is wishlisted
router.get('/check/:collegeId', authenticate, checkWishlist);

// POST /api/wishlist/:collegeId - Add college to wishlist
router.post('/:collegeId', authenticate, addToWishlist);

// DELETE /api/wishlist/:collegeId - Remove college from wishlist
router.delete('/:collegeId', authenticate, removeFromWishlist);

module.exports = router;
