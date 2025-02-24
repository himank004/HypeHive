import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config(); // Load environment variables

const router = express.Router();

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from .env
});

// API Route for Chatbot
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    // Send user input to OpenAI API for response
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can change to GPT-4 as needed
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply }); // Send the AI response back to the frontend
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

export default router;
