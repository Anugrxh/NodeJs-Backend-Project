const express = require("express");
const { Product } = require("../models/product");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = "public/uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save images in public/uploads
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Get all products (with optional category filter)
router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const productList = await Product.find(filter).populate("category");
    if (!productList) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).send(productList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error: error.message });
  }
});

// Create a new product with single image upload
router.post("/", upload.single("image"), async (req, res) => {
  const category = req.body.category;
  if (!category) return res.status(400).json({ message: "Category is required" });

  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagePath, // Save single image path
      images: req.body.images, // Optional multiple images
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
      numReviews: req.body.numReviews,
    });

    const savedProduct = await product.save();
    res.status(201).send(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
});

// Update (PATCH) product with multiple image uploads
router.patch("/:id", upload.array("images", 5), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const imagesPaths = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { images: imagesPaths },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndRemove(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

// Get product count
router.get("/get/count", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.send({ productCount });
  } catch (error) {
    res.status(500).json({ message: "Error counting products", error: error.message });
  }
});

// Get featured products
router.get("/get/featured/:count?", async (req, res) => {
  try {
    const count = req.params.count ? parseInt(req.params.count) : 0;
    const productFeatured = await Product.find({ isFeatured: true }).limit(count);
    res.send(productFeatured);
  } catch (err) {
    res.status(500).json({ message: "Error getting featured products", error: err.message });
  }
});

module.exports = router;
