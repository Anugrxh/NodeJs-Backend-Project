const express = require("express");
const router = express.Router();

const { Category } = require("../models/category");

router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    return res.status(404).json({ message: "No categories found" });
  }
  res.send(categoryList);
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).send(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: error.message });
  }
});

// UPDATE category (PATCH)
router.patch("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true }, // Returns the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).send(updatedCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id); // Updated method
      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting category", error: error.message });
    }
  });
  
router.post("/", async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color, // Fixed the duplicate `req.body.icon`
    });
    const savedCategory = await category.save();
    res.send(savedCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
});

module.exports = router;
