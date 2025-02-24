import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Get productId from URL
import toast from "react-hot-toast"; // Toast for notifications
import { useCartStore } from "../stores/useCartStore"; // Import useCartStore hook
import { useUserStore } from "../stores/useUserStore"; // Import useUserStore hook
import ProductCard from "../components/ProductCard"; // Correct the import to your component

const ProductPage = () => {
  const { productId } = useParams(); // Get productId from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCartStore(); // Use cart store to update cart
  const { user } = useUserStore(); // Get the logged-in user from the user store

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load product data. Please try again later.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!user) {
      // User not logged in
      toast.error("Please login to add this item to your cart.");
      return;
    }
    // User is logged in, proceed to add to cart
    addToCart(product);
    toast.success(`${product.name} successfully added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-white">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-white">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden border border-gray-700 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20" />
          </div>

          <div className="text-white">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="mt-4">{product.description}</p> {/* Product description */}
            <p className="mt-4 text-lg font-semibold">₹{product.price}</p>
            <button
              onClick={handleAddToCart} // Trigger the addToCart logic with login check
              className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-full"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
