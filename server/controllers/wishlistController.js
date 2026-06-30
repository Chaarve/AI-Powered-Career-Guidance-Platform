const Wishlist = require('../models/Wishlist');
const College = require('../models/College');
const logger = require('../utils/logger');

// Add a college to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collegeId } = req.params;

    // Check if college exists
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Check if already wishlisted
    const existing = await Wishlist.findOne({ userId, collegeId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'College already in wishlist',
        data: existing
      });
    }

    const wishlistItem = new Wishlist({ userId, collegeId });
    await wishlistItem.save();

    logger.info(`College ${collegeId} added to wishlist by user: ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'College added to wishlist',
      data: wishlistItem
    });
  } catch (error) {
    logger.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: error.message
    });
  }
};

// Remove a college from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collegeId } = req.params;

    const result = await Wishlist.findOneAndDelete({ userId, collegeId });
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'College not found in wishlist'
      });
    }

    logger.info(`College ${collegeId} removed from wishlist by user: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'College removed from wishlist'
    });
  } catch (error) {
    logger.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: error.message
    });
  }
};

// Get user's wishlist with full college details
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlistItems = await Wishlist.find({ userId }).sort({ added_at: -1 });
    
    // Get full college details for each wishlisted item
    const collegeIds = wishlistItems.map(item => item.collegeId);
    const colleges = await College.find({ _id: { $in: collegeIds } });

    // Map college details to wishlist items
    const wishlistWithDetails = wishlistItems.map(item => {
      const college = colleges.find(c => c._id.toString() === item.collegeId.toString());
      return {
        _id: item._id,
        collegeId: item.collegeId,
        added_at: item.added_at,
        college: college || null
      };
    }).filter(item => item.college !== null);

    res.status(200).json({
      success: true,
      data: {
        wishlist: wishlistWithDetails,
        total: wishlistWithDetails.length
      }
    });
  } catch (error) {
    logger.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    });
  }
};

// Check if a specific college is wishlisted
const checkWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collegeId } = req.params;

    const exists = await Wishlist.findOne({ userId, collegeId });

    res.status(200).json({
      success: true,
      data: { isWishlisted: !!exists }
    });
  } catch (error) {
    logger.error('Error checking wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist status',
      error: error.message
    });
  }
};

// Get all wishlisted college IDs for the user (for batch checking on Colleges page)
const getWishlistIds = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await Wishlist.find({ userId }, { collegeId: 1 });
    const ids = items.map(item => item.collegeId.toString());

    res.status(200).json({
      success: true,
      data: { collegeIds: ids }
    });
  } catch (error) {
    logger.error('Error fetching wishlist IDs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist IDs',
      error: error.message
    });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
  getWishlistIds
};
