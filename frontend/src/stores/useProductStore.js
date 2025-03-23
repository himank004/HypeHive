import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
    products: [],
    loading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products", productData);
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false,
            }));
        } catch (error) {
            console.log("Error creating product:", error);
            toast.error(error.response?.data?.error || "Failed to create product");
            set({ loading: false });
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products");
            console.log("API Response for all products:", response.data);  // Log API response
            set({ products: response.data.products || response.data, loading: false });
        } catch (error) {
            console.log("Error fetching all products:", error);
            set({ error: "Failed to fetch products", loading: false });
            toast.error(error.response?.data?.error || "Failed to fetch products");
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true });
        try {
            const normalizedCategory = category.toLowerCase();  // Normalize category casing
            const response = await axios.get(`/products/category/${normalizedCategory}`);
            console.log("API Response for category:", response.data);  // Log API response
            set({ products: response.data.products || response.data, loading: false });
        } catch (error) {
            console.log("Error fetching category products:", error);
            set({ error: "Failed to fetch products", loading: false });
            toast.error(error.response?.data?.error || "Failed to fetch products");
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
            await axios.delete(`/products/${productId}`);
            set((prevProducts) => ({
                products: prevProducts.products.filter((product) => product._id !== productId),
                loading: false,
            }));
        } catch (error) {
            console.log("Error deleting product:", error);
            set({ loading: false });
            toast.error(error.response?.data?.error || "Failed to delete product");
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}`);
            console.log("API Response for toggling featured:", response.data);  // Log API response
            set((prevProducts) => ({
                products: prevProducts.products.map((product) =>
                    product._id === productId
                        ? { ...product, isFeatured: response.data.isFeatured }
                        : product
                ),
                loading: false,
            }));
        } catch (error) {
            console.log("Error toggling featured product:", error);
            set({ loading: false });
            toast.error(error.response?.data?.error || "Failed to update product");
        }
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products/featured");
            console.log("API Response for featured products:", response.data);  // Log API response
            set({ products: response.data.products || response.data, loading: false });
        } catch (error) {
            console.log("Error fetching featured products:", error);
            set({ error: "Failed to fetch products", loading: false });
        }
    },
}));

// Additional log to check if products array is updated correctly
useProductStore.subscribe((state) => {
    console.log("Updated products array:", state.products);
});
