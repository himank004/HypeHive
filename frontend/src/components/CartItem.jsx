import React from "react";
import { useCartStore } from "../stores/useCartStore";
import { toast } from "react-hot-toast";

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCartStore();

  // Log item to debug size issue
  console.log("CartItem item:", JSON.stringify(item, null, 2));

  // Improved size extraction logic
  const productSize = item.size ?? item.selectedSize ?? item.sizes?.[0];

  // Handle increasing the quantity with a limit of 5
  const handleIncrease = () => {
    if (item.quantity < 5) {
      updateQuantity(item._id, item.quantity + 1)
        .then(() => toast.success("Quantity increased"))
        .catch((error) => {
          console.error("Error increasing quantity:", error);
          toast.error("Failed to update quantity");
        });
    } else {
      toast.error("Maximum of 5 products allowed per item.");
    }
  };

  // Handle decreasing the quantity
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.quantity - 1)
        .then(() => toast.success("Quantity decreased"))
        .catch((error) => {
          console.error("Error decreasing quantity:", error);
          toast.error("Failed to update quantity");
        });
    } else {
      toast.error("Minimum quantity is 1");
    }
  };

  // Handle removing the item from the cart
  const handleRemove = () => {
    removeFromCart(item._id)
      .then(() => toast.success("Item removed from cart"))
      .catch((error) => {
        console.error("Error removing item:", error);
        toast.error("Failed to remove item");
      });
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1">
          <img
            className="h-20 md:h-32 rounded object-cover"
            src={item.image}
            alt={item.name}
          />
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              -
            </button>
            <p>{item.quantity}</p>
            <button
              onClick={handleIncrease}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              +
            </button>
          </div>
          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-emerald-400">
              ₹{item.price * item.quantity}
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-2 md:order-2 md:max-w-md">
          <p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">
            {item.name}
          </p>
          <p className="text-sm text-gray-400">{item.description}</p>

          {/* Display Selected Size if Available */}
          {productSize && (
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-emerald-400">Size:</span> {productSize}
            </p>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={handleRemove}
              className="inline-flex items-center text-sm font-medium text-red-400 hover:text-red-300 hover:underline"
            >
              🗑️ Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
