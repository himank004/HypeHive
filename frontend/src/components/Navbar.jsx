import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();

  // Extract role and determine dashboard name
  const role = user?.role;
  const isAdmin = role === "admin" || role === "seller";
  const dashboardLabel = role === "seller" ? "Vendor Dashboard" : "Admin Dashboard";

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          {/* Logo as Image */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://media-hosting.imagekit.io//ccf0c2d3c7714fdb/pixelcut-export.png?Expires=1833015132&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=WsI2yJlu7uq9RbKerWJflFQV6CAqGDf9F139CwbV7lKY9ht56atGgV3SY7-tPPGToBxVRs3drMuRmbG6JXZs-CsXkRaTMokbGTkhPOjc7N~tvoS9NAU75YU74OP~pV2i5UiLc0t5luTuy96FStLlTYr580kWqCEg8jzjzUPPj0cKxLN7p2RhiBvsubc9Q~PdmMzAo420lr07vwSbN2S2Mb768NLYd98bBa9XJsi-g1xOiWDlUMhyq77QXmBwr56Y5zb3eWqfGjo5d4QBQbeI3ZoVVunpVql2w36p-W8NdKOy7F53e~JqMcfy1eT2~yX3PgNClXwAL7X6Dj41bkhKlg__"
              alt="HypeHive Logo"
              className="h-16"
            />
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
            >
              Home
            </Link>

            {user && (
              <Link
                to="/cart"
                className="relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out"
              >
                <ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" size={20} />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}

            {/* Show Admin or Vendor Dashboard based on role */}
            {isAdmin && (
              <Link
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center"
                to="/admin-dashboard"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">{dashboardLabel}</span>
              </Link>
            )}

            {user ? (
              <button
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
