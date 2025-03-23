import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";

const FASHION_CATEGORIES = ["fashion", "jeans", "t-shirts", "jackets", "suits"];
const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, cart } = useCartStore();
  const { user } = useUserStore();
  const [stockCount, setStockCount] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);

        // Initialize stock count (default 50 per size)
        const initialStock = {};
        SIZE_OPTIONS.forEach((size) => {
          initialStock[size] = 50;
        });
        setStockCount(initialStock);

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
      toast.error("Please login to add this item to your cart.");
      return;
    }
    if (isFashionProduct && !selectedSize) {
      setShowModal(true);
      return;
    }
    if (stockCount[selectedSize] <= 0) {
      toast.error("This size is out of stock.");
      return;
    }

    // Get the current cart items
    const cartItems = useCartStore.getState().cart;

    // Check if the product (same id & size) is already in the cart
    const existingItem = cartItems.find(
      (item) => item._id === product._id && item.selectedSize === selectedSize
    );

    if (existingItem && existingItem.quantity >= 5) {
      toast.error("You can only add up to 5 items of the same product.");
      return;
    }

    // Reduce stock count by 1
    setStockCount((prevStock) => ({
      ...prevStock,
      [selectedSize]: prevStock[selectedSize] - 1,
    }));

    // Add product with selected size and quantity
    addToCart({ ...product, selectedSize, quantity: (existingItem?.quantity || 0) + 1 });

    toast.success(`${product.name} (Size: ${selectedSize}) successfully added to cart!`);
  };

  const isFashionProduct =
    product && FASHION_CATEGORIES.includes(product.category.toLowerCase());

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const closeModal = () => setShowModal(false);

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
    <div className="min-h-screen bg-[#0f172a] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start bg-[#0f172a] text-white p-6 rounded-lg gap-8">
          {/* Image on the Left */}
          <div className="image-container w-full md:w-[437px] h-[511px] rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Product Details on the Right */}
          <div className="content-container w-full md:w-1/2 flex flex-col items-start gap-4">
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p className="text-gray-300">{product.description}</p>
            <p className="text-2xl font-semibold">₹{product.price}</p>

            {/* Size Selection for Fashion Products */}
            {isFashionProduct && (
              <div className="mb-4">
                <span className="block mb-2 text-lg font-semibold">
                  Select Size:
                </span>
                <div className="flex gap-2">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 rounded-lg border transition duration-200 ${
                        selectedSize === size
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-white text-black border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Stock availability */}
                {selectedSize && (
                  <p className="mt-2 text-lg text-yellow-400">
                    Only {stockCount[selectedSize]} left in stock!
                  </p>
                )}
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="bg-emerald-500 text-white py-2 px-6 rounded-lg hover:bg-emerald-600 transition duration-200 mt-2"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Size Selection Alert */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              Select a Size
            </h3>
            <p className="text-gray-700 mb-4">
              Please choose a size before adding the product to the cart.
            </p>
            <button
              onClick={closeModal}
              className="bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition duration-200"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
