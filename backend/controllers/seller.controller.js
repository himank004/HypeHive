import Product from "../models/product.model.js";

export const listSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id });
    res.json(products);
  } catch (error) {
    console.log("Error in listSellerProducts", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createSellerProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      sellerId: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createSellerProduct", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
