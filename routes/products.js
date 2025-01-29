const express = require("express");
const { Product } = require("../models/product");
const router = express.Router();
const mongoose = require("mongoose");

 
// Get all products
router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories){
        filter = {category:req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate("category");
    if (!productList) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).send(productList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
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
    res
      .status(500)
      .json({ message: "Error retrieving product", error: error.message });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  const category = req.body.category;
  if (!category)
    return res.status(400).json({ message: "Category is required" });
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      images: req.body.images,
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
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
});

// Update (PATCH) a product
router.patch("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: "Category is required" });
  }
  const category = req.body.category;
  if (!category)
    return res.status(400).json({ message: "Category is required" });
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
      },
      { new: true }, // Return the updated document
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).send(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
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
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});

// geting count of products in Product Table


router.get("/get/count", async (req, res) => {
    try {
      const productCount = await Product.countDocuments(); // No callback needed
      res.send({
        productCount: productCount,
      });
    } catch (error) {
      res.status(500).json({ message: "Error counting products", error: error.message });
    }
  });
  

//getting features Products 


router.get('/get/featured/:count?', async (req, res) => {
    try {
        const count = req.params.count ? parseInt(req.params.count) : 0;
        const productFeatured = await Product.find({ isFeatured: true }).limit(count);
        res.send(productFeatured);
    } catch (err) {
        res.status(500).json({ message: "Error getting featured products", error: err.message });
    }
});

  

module.exports = router;

