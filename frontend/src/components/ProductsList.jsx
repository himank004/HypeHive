import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { Menu, Transition } from "@headlessui/react";
import { useState, Fragment } from "react";

const ProductsList = () => {
    const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "jeans", "t-shirts", "shoes", "glasses", "suits", "bags",
        "jackets", "smartphones", "accessories", "tablets",
        "laptops", "headphones", "cameras", "fiction",
        "non-fiction", "comics", "All",
    ];

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products?.filter((product) => product.category === selectedCategory);

    return (
        <motion.div className="bg-gray-800 shadow-lg rounded-lg max-w-5xl mx-auto overflow-hidden">
            {/* Product Table */}
            <div className="max-h-[600px] overflow-y-auto overflow-x-hidden">
                <table className="min-w-full table-auto divide-y divide-gray-700">
                    <thead className="bg-gray-700 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                Product
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                Price
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                {/* Category Header with Dropdown */}
                                <div className="flex items-center gap-2">
                                    Category
                                    <Menu as="div" className="relative inline-block text-left">
                                        <Menu.Button className="px-3 py-1 bg-emerald-500 text-white rounded-md text-xs">
                                            {selectedCategory}
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 mt-2 max-h-60 w-40 overflow-y-auto bg-white shadow-md rounded-md">
                                                {categories.map((category) => (
                                                    <Menu.Item key={category}>
                                                        <button
                                                            onClick={() => handleCategoryChange(category)}
                                                            className={`block w-full px-4 py-2 text-left text-sm ${
                                                                selectedCategory === category
                                                                    ? "text-emerald-500 bg-gray-100"
                                                                    : "text-gray-700 hover:bg-gray-200"
                                                            }`}
                                                        >
                                                            {category}
                                                        </button>
                                                    </Menu.Item>
                                                ))}
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                Featured
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {filteredProducts?.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-700">
                                {/* Product Name & Image */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center min-w-0">
                                        <div className="flex-shrink-0 h-12 w-12">
                                            <img
                                                className="h-12 w-12 rounded-full object-cover"
                                                src={product.image}
                                                alt={product.name}
                                            />
                                        </div>
                                        <div className="ml-4 truncate">
                                            <div className="text-sm font-medium text-white">
                                                {product.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Price */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-300">₹{product.price.toFixed(2)}</div>
                                </td>

                                {/* Category */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-300">{product.category}</div>
                                </td>

                                {/* Featured Toggle Button */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleFeaturedProduct(product._id)}
                                        className={`p-1 rounded-full ${
                                            product.isFeatured
                                                ? "bg-yellow-400 text-gray-900"
                                                : "bg-gray-600 text-gray-300"
                                        } hover:bg-yellow-500 transition-colors duration-200`}
                                    >
                                        <Star className="h-5 w-5" />
                                    </button>
                                </td>

                                {/* Delete Button */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ProductsList;
