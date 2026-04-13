const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a product name"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
  },
  oldPrice: {
    type: Number,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  image: {
    type: String,
    required: [true, "Please add an image URL"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, "Please add a category (e.g. T-shirt, Jeans)"],
  },
  style: {
    type: String,
    enum: ["Casual", "Formal", "Party", "Gym"],
    default: "Casual",
  },
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isTopSeller: {
    type: Boolean,
    default: false,
  },
  productType: {
    type: String,
    enum: ["regular", "loyalty-only", "hybrid"],
    default: "regular",
  },
  pointsPrice: {
    type: Number,
    default: 0,
  },
  variants: [{
    color: String,
    images: [String],
    price: Number,
    oldPrice: Number,
    sizes: [String]
  }],
  thumbnails: {
    type: [String],
    default: [],
  },
  baseColor: {
    type: String,
    default: '',
  },
  colors: {
    type: [String],
    default: [],
  },
  sizes: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
