import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { Slider } from "@mui/material";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const CategoryPage = () => {
	const { fetchProductsByCategory, products } = useProductStore();
	const { category } = useParams();
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [priceRange, setPriceRange] = useState([0, 1000000]);
	const [sortOption, setSortOption] = useState("relevance");
	const [searchQuery, setSearchQuery] = useState("");

	// Fetch products
	useEffect(() => {
		fetchProductsByCategory(category);
	}, [fetchProductsByCategory, category]);

	// Filter & Sort
	useEffect(() => {
		let filtered = products.filter(
			(product) =>
				product.price >= priceRange[0] &&
				product.price <= priceRange[1] &&
				product.name.toLowerCase().includes(searchQuery.toLowerCase())
		);

		switch (sortOption) {
			case "priceLowToHigh":
				filtered.sort((a, b) => a.price - b.price);
				break;
			case "priceHighToLow":
				filtered.sort((a, b) => b.price - a.price);
				break;
			case "popularity":
				filtered.sort((a, b) => b.popularity - a.popularity);
				break;
			default:
				break;
		}

		setFilteredProducts(filtered);
	}, [products, priceRange, sortOption, searchQuery]);

	return (
		<div className='min-h-screen bg-gray-900 text-white'>
			<div className='max-w-screen-xl mx-auto px-6 py-16'>

				{/* Search Bar */}
				<motion.div
					className='flex justify-center mb-10'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<input
						type='text'
						placeholder='🔍 Search products...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-2/3 md:w-1/2 px-5 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-emerald-500 focus:ring-2 focus:outline-none transition-all'
					/>
				</motion.div>

				{/* Category Title */}
				<motion.h1
					className='text-center text-5xl font-extrabold text-emerald-400 mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</motion.h1>

				{/* Controls: Filter & Sort */}
				<div className='flex flex-col sm:flex-row justify-between items-center mb-8 gap-4'>
					<button
						className='px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg hover:scale-105 transition-transform'
						onClick={() => document.getElementById("filter-modal").showModal()}
					>
						Filter
					</button>

					{/* Sort Dropdown */}
<Menu as='div' className='relative inline-block text-left z-50'>
    <Menu.Button className='px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg flex items-center gap-2 shadow-lg hover:scale-105 transition-transform'>
        Sort By <ChevronDownIcon className='w-5 h-5 text-gray-400' />
    </Menu.Button>

    <Transition
        enter='transition ease-out duration-200'
        enterFrom='transform scale-95 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition ease-in duration-150'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-95 opacity-0'
    >
        <Menu.Items className='absolute top-full right-0 mt-2 w-56 bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50'>
            {["priceLowToHigh", "priceHighToLow", "popularity", "relevance"].map((option) => (
                <Menu.Item key={option}>
                    <button
                        className={`w-full text-left px-4 py-3 hover:bg-gray-700 ${
                            sortOption === option ? "text-emerald-400" : "text-gray-300"
                        }`}
                        onClick={() => setSortOption(option)}
                    >
                        {option === "priceLowToHigh" && "Price: Low to High"}
                        {option === "priceHighToLow" && "Price: High to Low"}
                        {option === "popularity" && "Popularity"}
                        {option === "relevance" && "Relevance"}
                    </button>
                </Menu.Item>
            ))}
        </Menu.Items>
    </Transition>
</Menu>

				</div>

				{/* Filter Modal */}
				<dialog id="filter-modal" className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
					<h2 className="text-xl font-semibold mb-4">Filter Options</h2>

					{/* Price Slider */}
					<div className="mb-4">
						<h3 className="text-lg font-medium mb-2">Price Range</h3>
						<Slider
							value={priceRange}
							onChange={(e, newValue) => setPriceRange(newValue)}
							valueLabelDisplay="auto"
							min={0}
							max={1000000}
							sx={{
								color: "emerald",
								"& .MuiSlider-thumb": { backgroundColor: "white" },
								"& .MuiSlider-track": { backgroundColor: "emerald" },
							}}
						/>
					</div>

					<button
						className="mt-4 px-4 py-2 bg-emerald-500 rounded-lg shadow-md hover:bg-emerald-600"
						onClick={() => document.getElementById("filter-modal").close()}
					>
						Close
					</button>
				</dialog>

				{/* Product Grid */}
				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{filteredProducts.length === 0 ? (
						<h2 className='text-3xl font-semibold text-gray-400 col-span-full'>
							No products found 😞
						</h2>
					) : (
						filteredProducts.map((product) => (
							<ProductCard key={product._id} product={product} />
						))
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default CategoryPage;
