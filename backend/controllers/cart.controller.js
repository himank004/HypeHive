import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Razorpay initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get Cart Products
export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    const user = req.user; // Assuming the user info is attached to the request
    const existingItemIndex = user.cartItems.findIndex(item => item.id === productId);

    if (existingItemIndex !== -1) {
      user.cartItems[existingItemIndex].quantity += quantity;
    } else {
      user.cartItems.push({ id: productId, quantity });
    }

    await user.save();
    res.json({ message: "Product added to cart", cartItems: user.cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// Remove All from Cart
export const removeAllFromCart = async (req, res) => {
  try {
    const user = req.user;
    user.cartItems = [];
    await user.save();
    res.json({ message: "All items removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing items from cart" });
  }
};

// Update Quantity
export const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const user = req.user;
    const itemIndex = user.cartItems.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    user.cartItems[itemIndex].quantity = quantity;
    await user.save();
    res.json({ message: "Quantity updated", cartItems: user.cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating quantity" });
  }
};

// Checkout session logic
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products in the cart" });
    }

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode });
      if (!coupon) {
        return res.status(400).json({ message: "Invalid coupon code" });
      }
    }

    const orderAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);
    const discount = coupon ? (orderAmount * coupon.discountPercentage) / 100 : 0;
    const totalAmount = orderAmount - discount;

    const order = new Order({
      products,
      couponCode,
      totalAmount,
    });
    await order.save();

    const options = {
      amount: totalAmount * 100,  // Convert to paise
      currency: "INR",
      receipt: `order_${order._id}`,
    };

    razorpay.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({ message: "Razorpay error: " + err.message });
      }

      res.json({
        id: order.id,
        key: process.env.RAZORPAY_KEY_ID,
        totalAmount,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Checkout success handling
export const checkoutSuccess = async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    const order = await razorpay.orders.fetch(orderId);

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === signature) {
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: order.receipt },
        { status: "Paid", paymentId },
        { new: true }
      );
      res.json({ success: true, redirectUrl: "/purchase-success" });
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing payment" });
  }
};
