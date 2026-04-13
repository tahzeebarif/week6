const express = require("express");
const Review = require("../models/Review");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// @desc    Get all reviews (global)
// @route   GET /api/reviews
// @access  Public
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort("-createdAt").limit(10).populate('product', 'name');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort("-createdAt");
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Add review for a product
// @route   POST /api/reviews
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "Product already reviewed" });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      isVerified: true // Simplified logic for now
    });

    // Update product rating
    const reviews = await Review.find({ product: productId });
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    product.reviewsCount = reviews.length;
    await product.save();

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
