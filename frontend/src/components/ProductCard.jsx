import React from "react";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { Link, useLocation } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const location = useLocation();

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} successfully added to cart!`);
  };

  const isProductPage = location.pathname === `/product/${product._id}`;
  const fallbackImage = "/default-image.jpg";
  const productImage = product.image || fallbackImage;

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  return (
    <div className="relative flex flex-col w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-gray-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden">
      {/* Product Image */}
      {!isProductPage && (
        <Link
          to={`/product/${product._id}`}
          className="relative w-full h-64 flex justify-center items-center bg-gray-100"
        >
          <img
            src={productImage}
            alt={product.name}
            className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
          />
        </Link>
      )}

      {/* Product Details */}
      <div className="p-5 flex flex-col gap-3 bg-gray-900/80 backdrop-blur-md">
        <Link to={`/product/${product._id}`} className="hover:underline">
          <h5 className="text-xl font-semibold text-white truncate">{product.name}</h5>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yellow-400 shadow-md">₹{product.price}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-3">
          {!isProductPage && (
            <Link
              to={`/product/${product._id}`}
              className="flex-1 flex items-center justify-center bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-blue-700 shadow-md hover:shadow-lg"
            >
              View Details
            </Link>
          )}

          <button
            className="flex-1 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:from-emerald-600 hover:to-green-700 shadow-md hover:shadow-lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
