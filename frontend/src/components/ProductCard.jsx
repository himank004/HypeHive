import React from 'react';
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { Link, useLocation } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const location = useLocation(); // Get current location from React Router

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart");
      return;
    }

    addToCart(product);
    toast.success(`${product.name} successfully added to cart!`);
  };

  const isProductPage = location.pathname === `/product/${product._id}`; // Check if we are on the product detail page

  // Path to the fallback image in the public folder
  const fallbackImage = '/default-image.jpg';  // Replace with the correct path

  // Use the first image from the product if available, otherwise fall back to default image
  const productImage = product.image || fallbackImage;

  const handleImageError = (e) => {
    e.target.src = fallbackImage; // Change to fallback image if the main one fails
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-lg border border-gray-700 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
      {/* Display product image */}
      {!isProductPage && (
        <Link to={`/product/${product._id}`} className="relative flex justify-center w-full h-60 overflow-hidden rounded-xl">
          <img 
            src={productImage}
            alt={product.name}
            className="object-cover w-full h-full"
            onError={handleImageError} // Add error handler
          />
        </Link>
      )}

      <div className="p-4 mt-4">
        <Link to={`/product/${product._id}`} className="hover:underline">
          <h5 className="text-xl font-semibold text-emerald-400 truncate">{product.name}</h5>
        </Link>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-emerald-400">${product.price}</span>
          </p>
        </div>

        <div className="flex gap-2">
          {/* Only show the "View Details" button when not on the product detail page */}
          {!isProductPage && (
            <Link 
              to={`/product/${product._id}`} 
              className="flex-1 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              View Details
            </Link>
          )}

          {/* Add to cart button */}
          <button 
            className="flex-1 items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={22} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
