const express = require("express");
const Product = require("../models/Product");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload, cloudinary } = require("../middleware/cloudinaryConfig");
const router = express.Router();

// @desc    Get all products (with filtering & pagination)
// @route   GET /api/products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { style, category, minPrice, maxPrice, color, size, sort, page = 1, limit = 9 } = req.query;
    let query = {};

    // Basic filters
    if (style) query.style = style;
    if (category) {
       const categories = category.split(',');
       query.category = { $in: categories.map(c => new RegExp(`^${c}$`, 'i')) };
    }

    // Intersection filters for Price, Color, Size
    if (minPrice || maxPrice || color || size) {
        query.$and = [];
    }

    // Price range (supporting Variant pricing logic)
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      
      query.$and.push({ $or: [
         { price: priceFilter },
         { "variants.price": priceFilter }
      ]});
    }

    // Color
    if (color) {
      query.$and.push({ $or: [
        { baseColor: { $regex: new RegExp(color, "i") } },
        { colors: { $regex: new RegExp(color, "i") } },
        { "variants.color": { $regex: new RegExp(color, "i") } }
      ]});
    }

    // Size
    if (size) {
      query.$and.push({ $or: [
        { sizes: { $regex: new RegExp(size, "i") } },
        { "variants.sizes": { $regex: new RegExp(size, "i") } }
      ]});
    }

    // Sorting
    let sortOptions = {};
    if (sort === "price-low") sortOptions = { price: 1 };
    else if (sort === "price-high") sortOptions = { price: -1 };
    else if (sort === "newest") sortOptions = { createdAt: -1 };
    else sortOptions = { createdAt: -1 };

    // Pagination constants
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skipNum)
      .limit(limitNum);

    res.status(200).json({ 
      success: true, 
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limitNum),
      currentPage: pageNum,
      data: products 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post("/", protect, authorize("admin", "super-admin"), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put("/:id", protect, authorize("admin", "super-admin"), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin", "super-admin"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Upload product image to Cloudinary
// @route   POST /api/products/upload
// @access  Private/Admin
router.post("/upload", protect, authorize("admin", "super-admin"), upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Stream upload to Cloudinary
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'shopco_products' },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload(req);
    console.log("[CLOUDINARY] Direct Stream Upload success:", result.secure_url);
    
    res.status(200).json({ 
      success: true, 
      data: result.secure_url 
    });
  } catch (err) {
    console.error("[CLOUDINARY] Direct Stream Upload error:", err);
    res.status(400).json({ success: false, message: "Cloudinary Upload Error", error: err.message });
  }
});

module.exports = router;
