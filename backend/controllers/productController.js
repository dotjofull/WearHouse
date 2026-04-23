const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "wearhouse_products" }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      })
      .end(fileBuffer);
  });
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadedImage.secure_url;
    }

    const product = new Product({
      name: name.toLowerCase(),
      description,
      price,
      category,
      stock,
      imageUrl,
      createdBy: req.user._id,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
  console.error("CREATE PRODUCT ERROR:", error);
  res.status(500).json({
    message: "Server error",
    error: error.message,
  });
}
};

const getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    let products = await Product.find(filter)
      .populate("category", "title")
      .populate("createdBy", "name email");

    if (search) {
      const normalizedSearch = search.toLowerCase();

      products = products.filter((product) =>
        product.name.toLowerCase().includes(normalizedSearch)
      );
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "title description")
      .populate("createdBy", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (category) {
      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      product.category = category;
    }

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer);
      product.imageUrl = uploadedImage.secure_url;
    }

    product.name = name ? name.toLowerCase() : product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.stock = stock !== undefined ? stock : product.stock;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};