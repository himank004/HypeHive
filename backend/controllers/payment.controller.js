import Stripe from "stripe";
import dotenv from "dotenv";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        let totalAmount = 0;

        // Prepare line items for Stripe session
        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100); // Stripe expects the amount in paise for INR
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: "INR",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
                quantity: product.quantity || 1,
            };
        });

        // Check and apply coupon if available
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({
                code: couponCode,
                userId: req.user._id,
                isActive: true,
            });
            if (coupon) {
                totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
            }
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon
                ? [
                      {
                          coupon: await createStripeCoupon(coupon.discountPercentage),
                      },
                  ]
                : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    }))
                ),
            },
        });

        // Create a new coupon if the total amount exceeds a threshold (₹200)
        if (totalAmount >= 20000) {
            await createNewCoupon(req.user._id);
        }

        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
    } catch (error) {
        console.error("Error processing checkout:", error);
        res.status(500).json({ message: "Error processing checkout", error: error.message });
    }
};

export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    {
                        code: session.metadata.couponCode,
                        userId: session.metadata.userId,
                    },
                    {
                        isActive: false,
                    }
                );
            }

            // Create or update an Order in the database
            const products = JSON.parse(session.metadata.products);
            const existingOrder = await Order.findOne({ stripeSessionId: sessionId });

            if (existingOrder) {
                // Update existing order if it already exists
                existingOrder.products = products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price,
                }));
                existingOrder.totalAmount = session.amount_total / 100; // Convert from paise to rupees
                await existingOrder.save();
            } else {
                // Create a new order if it doesn't exist
                const newOrder = new Order({
                    user: session.metadata.userId,
                    products: products.map((product) => ({
                        product: product.id,
                        quantity: product.quantity,
                        price: product.price,
                    })),
                    totalAmount: session.amount_total / 100, // Convert from paise to rupees
                    stripeSessionId: sessionId,
                });
                await newOrder.save();
            }

            res.status(200).json({
                success: true,
                message: "Payment successful, order processed, and coupon deactivated if used.",
            });
        } else {
            res.status(400).json({
                message: "Payment was not successful.",
            });
        }
    } catch (error) {
        console.error("Error processing successful checkout:", error);
        res.status(500).json({
            message: "Error processing successful checkout",
            error: error.message,
        });
    }
};

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once",
    });
    return coupon.id;
}

async function createNewCoupon(userId) {
    await Coupon.findOneAndDelete({ userId });

    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId,
    });

    await newCoupon.save();

    return newCoupon;
}
