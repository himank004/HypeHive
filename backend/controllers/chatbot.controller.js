const axios = require("axios");

const callAI = async (message) => {
  try {
    const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1"; 
    const HF_HEADERS = { Authorization: "Bearer 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" };

    const requestData = { inputs: message };

    const { data } = await axios.post(HF_API_URL, requestData, { headers: HF_HEADERS });

    return data.generated_text || "I'm not sure how to respond.";
  } catch (error) {
    console.error("Hugging Face API Error:", error?.response?.data || error.message);
    return "AI is currently unavailable. Try again later.";
  }
};


