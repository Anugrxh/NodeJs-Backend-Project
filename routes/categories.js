const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");
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

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (!categoryList) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.send(categoryList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error: error.message });
  }
});

// Get category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).send(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error: error.message });
  }
});

// Create a new category with an image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    let category = new Category({
      name: req.body.name,
      icon: imagePath, // Store image path instead of icon URL
      color: req.body.color,
    });

    const savedCategory = await category.save();
    res.status(201).send(savedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
});

// Update a category (PATCH) with image upload
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.icon;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: imagePath,
        color: req.body.color,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).send(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error: error.message });
  }
});

// Delete a category
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
});

module.exports = router;
