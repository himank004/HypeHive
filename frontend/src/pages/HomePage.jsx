import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import Chatbot from "../components/Chatbot";

const categories = [
  {
    name: "Fashion",
    imageUrl: "/fashion-thumbnail.png",
    subcategories: [
      { href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
      { href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
      { href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
      { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
      { href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
      { href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
      { href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
    ],
  },
  {
    name: "Mobiles",
    imageUrl: "/mobiles-thumbnail.webp",
    subcategories: [
      { href: "/smartphones", name: "Smartphones", imageUrl: "/mobile.jpg" },
      { href: "/accessories", name: "Accessories", imageUrl: "/accessories.avif" },
      { href: "/tablets", name: "Tablets", imageUrl: "/tablets.webp" },
    ],
  },
  {
    name: "Electronics",
    imageUrl: "/electronics-thumbnail.jpg",
    subcategories: [
      { href: "/laptops", name: "Laptops", imageUrl: "/laptop.jpg" },
      { href: "/headphones", name: "Headphones", imageUrl: "/headphone.webp" },
      { href: "/cameras", name: "Cameras", imageUrl: "/camera.avif" },
      
    ],
  },
  {
    name: "Books",
    imageUrl: "/books-thumbnail.jpeg",
    subcategories: [
      { href: "/fiction", name: "Fiction", imageUrl: "/fictional.jpg" },
      { href: "/non-fiction", name: "Non-Fiction", imageUrl: "/nonfiction.jpg" },
      { href: "/comics", name: "Comics", imageUrl: "/comic.webp" },
    ],
  },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  const toggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  // Filtering categories and subcategories based on search
  const filteredCategories = categories
    .map((category) => {
      const filteredSubcategories = category.subcategories.filter((sub) =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        ...category,
        subcategories: filteredSubcategories,
      };
    })
    .filter((category) => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      category.subcategories.length > 0
    );

  // Automatically expand categories if search is applied
  useEffect(() => {
    if (searchTerm) {
      const firstMatchingCategory = filteredCategories.find((category) => category.subcategories.length > 0);
      setExpandedCategory(firstMatchingCategory ? firstMatchingCategory.name : null);
    }
  }, [searchTerm]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16">
        
        {/* Luxury Heading */}
        <h1 className="text-center text-6xl font-extrabold text-gold-500 tracking-wide drop-shadow-lg mb-6">
          Discover Premium Collections
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Elevate your style with top-tier fashion, gadgets, and more.
        </p>

        {/* Search Bar */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-5 py-3 text-lg rounded-lg text-gray-900 shadow-inner focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white/20 backdrop-blur-md border border-gray-600"
          />
        </div>

        {/* Category Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12 px-4 py-2">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-44 cursor-pointer rounded-xl overflow-hidden shadow-xl border-2 border-gold-500 group"
              onClick={() => toggleCategory(category.name)}
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <h2 className="absolute bottom-5 left-5 text-white text-2xl font-bold transition-colors duration-300 group-hover:text-gold-400">
                {category.name}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Expanding Subcategories */}
        <AnimatePresence>
          {expandedCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12 p-4 rounded-lg border border-gray-700 bg-gray-900/70 shadow-lg"
            >
              {filteredCategories
                .find((cat) => cat.name === expandedCategory)
                ?.subcategories.map((sub) => (
                  <CategoryItem category={sub} key={sub.name} />
                ))}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Premium Offers Carousel */}
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showStatus={false}
          className="mb-12"
        >
          <div>
            <img src="/Untitled.png" alt="Offer 1" className="rounded-xl shadow-lg" />
            <p className="legend text-xl font-bold">🔥 Exclusive 50% Off on Fashion!</p>
          </div>
          <div>
            <img src="/mobile-sale.png" alt="Offer 2" className="rounded-xl shadow-lg" />
            <p className="legend text-xl font-bold">📱 Grab the Latest Smartphones Now!</p>
          </div>
          <div>
            <img src="/book-sale.png" alt="Offer 3" className="rounded-xl shadow-lg" />
            <p className="legend text-xl font-bold">📖 Luxury Book Collection Sale!</p>
          </div>
        </Carousel>

        {/* Featured Products */}
        {!isLoading && products.length > 0 && (
          <div className="border-t border-gray-700 pt-12">
      
            <FeaturedProducts featuredProducts={products} />
          </div>
        )}
      </div>
      {/*<Chatbot/>*/}
    </div>
  );
};

export default HomePage;
