import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Example function to create a payment intent
export const createPaymentIntent = async (amount) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,   // Convert amount to paise (smallest currency unit for INR)
            currency: "INR",        // Set currency to INR for rupee
            payment_method_types: ["card"],
        });

        return paymentIntent.client_secret;
    } catch (error) {
        console.error("Error creating payment intent:", error);
        throw error;
    }
};
