import axios from "./axios"; // Ensure this path is correct

// Function to fetch products based on category and price range for the chatbot
export const fetchProductsForChatbot = async (category, minPrice, maxPrice) => {
    try {
        const response = await axios.get(
            `/api/echo/chatbot/products?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`
        );

        return response.data.message; // Return the response message to the chatbot
    } catch (error) {
        console.error("Error fetching products for chatbot:", error);
        return "Sorry, I couldn't retrieve products right now.";
    }
};
