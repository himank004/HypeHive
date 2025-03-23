import React from "react";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const CheckoutButton = ({ cart, coupon }) => {
  const handlePayment = async () => {
    try {
      const res = await axios.post("/payments/create-checkout-session", {
        products: cart,
        couponCode: coupon ? coupon.code : null,
      });

      console.log("Checkout session response:", res.data); // Debugging

      if (!res.data.orderId) {
        throw new Error("No session ID found in the response.");
      }

      const options = {
        key: res.data.key,
        amount: res.data.totalAmount * 100,
        currency: "INR",
        order_id: res.data.orderId,
        name: "E-Commerce Checkout",
        description: "Order Payment",
        handler: function (response) {
          handleCheckoutSuccess(response.razorpay_payment_id, res.data.orderId, response.razorpay_signature);
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
        theme: {
          color: "#28a745",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleCheckoutSuccess = async (paymentId, orderId, signature) => {
    try {
      const res = await axios.post("/payments/checkout-success", {
        paymentId,
        orderId,
        signature,
      });

      if (res.data.success) {
        toast.success("Payment Successful! Order Placed.");
      } else {
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      console.error("Error processing payment success:", error);
      toast.error("Error verifying payment.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
    >
      Proceed to Pay
    </button>
  );
};

export default CheckoutButton;
