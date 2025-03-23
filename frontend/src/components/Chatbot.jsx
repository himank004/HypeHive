import React, { useState } from "react";
import axios from "../lib/axios"; // Adjust if your axios instance is elsewhere

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const { data } = await axios.post("/chatbot", { message: input });

      if (Array.isArray(data.response)) {
        // Format product responses
        setResponse(
          data.response.map((p) => `${p.name} - ₹${p.price}`).join("\n")
        );
      } else {
        setResponse(data.response);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setResponse("Failed to get a response.");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen flex flex-col items-center text-white">
      <h1 className="text-2xl font-semibold mb-4">Chat with Echo</h1>
      <div className="flex w-full max-w-md">
        <input
          type="text"
          className="p-2 border border-gray-600 bg-gray-800 text-white rounded-l-md w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a product..."
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
      {response && (
        <pre className="mt-4 bg-gray-800 text-white p-3 rounded-md w-full max-w-md">
          {response}
        </pre>
      )}
    </div>
  );
};

export default Chatbot;
