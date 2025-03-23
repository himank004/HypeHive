import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Link2, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import toast from "react-hot-toast";

// Updated categories list
const categories = [
	"jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags",
	"smartphones", "accessories", "tablets", "laptops", "headphones",
	"cameras", "fiction", "non-fiction", "comics"
];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
		sizes: "",  // Sizes as a comma-separated string
	});
	const [imageUrl, setImageUrl] = useState("");
	const [hasSizes, setHasSizes] = useState(false);  // Toggle for size options
	const { createProduct, loading } = useProductStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category || !newProduct.image) {
			toast.error("Please fill in all required fields.");
			return;
		}

		const productData = {
			...newProduct,
			sizes: newProduct.sizes.split(",").map(size => size.trim()).filter(size => size !== "") // Convert string to array
		};

		try {
			await createProduct(productData);
			setNewProduct({ name: "", description: "", price: "", category: "", image: "", sizes: "" });
			setImageUrl("");
			setHasSizes(false);  // Reset size toggle
			toast.success("Product created successfully!");
		} catch {
			toast.error("Error creating a product.");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
				setImageUrl("");  // Clear the URL if a file is uploaded
			};
			reader.readAsDataURL(file);
		}
	};

	const handleImageUrlChange = (e) => {
		const url = e.target.value;
		setImageUrl(url);
		setNewProduct({ ...newProduct, image: url });
	};

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Description
					</label>
					<textarea
						id='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Price
					</label>
					<input
						type='number'
						id='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white'
						required
					/>
				</div>

				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Category
					</label>
					<select
						id='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>
				</div>

				<div className='mt-1'>
					<label
						htmlFor='image-url'
						className='block text-sm font-medium text-gray-300 mb-2'
					>
						Image URL (optional)
					</label>
					<div className='flex items-center'>
						<input
							type='url'
							id='image-url'
							placeholder='Enter image URL'
							value={imageUrl}
							onChange={handleImageUrlChange}
							className='w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						/>
						<Link2 className='ml-2 text-emerald-500' />
					</div>
				</div>

				<div className='mt-2 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
					<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>
					{newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image added</span>}
				</div>
				<div className='flex items-center mb-4'>
					<input
						type='checkbox'
						id='hasSizes'
						checked={hasSizes}
						onChange={(e) => {
							setHasSizes(e.target.checked);
							setNewProduct({ ...newProduct, sizes: e.target.checked ? "" : "" });
						}}
						className='mr-2'
					/>
					<label htmlFor='hasSizes' className='text-gray-300'>
						Contains Different Sizes
					</label>
				</div>

				{hasSizes && (
					<div>
						<label htmlFor='sizes' className='block text-sm font-medium text-gray-300'>
							Available Sizes (separate by commas)
						</label>
						<input
							type='text'
							id='sizes'
							placeholder='e.g., S, M, L, XL'
							value={newProduct.sizes}
							onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
							className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white'
						/>
					</div>
				)}

				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};

export default CreateProductForm;
