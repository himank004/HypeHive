import express from "express";
import fs from "fs";
import path from "path";
import axios from "axios";

const router = express.Router();

// Hugging Face AI model for chat
const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct";
const HF_HEADERS = { Authorization: "Bearer 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" }; // Get a free key at https://huggingface.co/settings/tokens

const productsFilePath = path.join(process.cwd(), "products_list.txt");
let PRODUCTS = [];
console.log("Loaded Products:", PRODUCTS);


// Load products from the text file
const loadProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, "utf8");
    PRODUCTS = data
      .split("\n")
      .map((line) => {
        const [name, price] = line.split(" - ");
        return { name: name?.trim(), price: parseFloat(price?.trim()) };
      })
      .filter((p) => p.name && !isNaN(p.price));
  } catch (error) {
    console.error("Error loading products:", error.message);
  }
};
loadProducts();

// Function to call Hugging Face AI
const callAI = async (message) => {
    try {
      const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"; // Update if using another model
      const HF_HEADERS = { Authorization: "Bearer YOUR_HUGGINGFACE_API_KEY" };
  
      const requestData = {
        inputs: message,
        parameters: {
          candidate_labels: ["product inquiry", "pricing", "general query"]
        }
      };
  
      const { data } = await axios.post(HF_API_URL, requestData, { headers: HF_HEADERS });
      
      return data?.labels?.[0] || "I couldn't understand that.";
    } catch (error) {
      console.error("Hugging Face API Error:", error?.response?.data || error.message);
      return "AI is currently unavailable. Try again later.";
    }
  };
  
  

// Chatbot Route
router.post("/chatbot", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ response: "Please ask a valid question." });

  // Check if the question is about a product
  const matchedProducts = PRODUCTS.filter((p) =>
    message.toLowerCase().includes(p.name.toLowerCase())
  );

  if (matchedProducts.length > 0) {
    return res.json({
      response: matchedProducts.map((p) => `${p.name} - ₹${p.price}`).join("\n"),
    });
  }

  // If not about products, use AI model
  const aiResponse = await callAI(message);
  return res.json({ response: aiResponse });
});

export default router;
