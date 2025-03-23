import React, { useState } from 'react';
import axios from '../lib/axios'; // Adjust the path to your axios instance
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast for notifications
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter a valid email!");
      return;
    }

    try {
      const response = await axios.post('/api/newsletter/subscribe', { email });
      toast.success(response.data.message);
      setEmail(''); // Clear input on success
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || "Failed to subscribe. Please try again."
      );
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src="https://media-hosting.imagekit.io//888407157d634b50/pixelcut-export%20(2).png?Expires=1833015568&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=KIaRrD42xhewLHWJqPAN2zRjtS-FwjlUUUCceQUVYmVpZUy~Y7iJx2IfuKiEp2bB07bBYPAAu~QYpRFqQ37gKdk3QzE~Lp8U8UQgPPxMYW44mrY4QrrXWJIXIzo2sOScVBZpqvoOJZCXojzFaj944A40RbXdS6q9UFnY2Q6vc6WbU2ZSw7VfsgMRkMP3uDSjZAXOfufsmvPqmOl-4Nu7-A0upnA73dlB6tBixPs10fqvfeTGQeuyVwdylSMwbxoupi0JFayW31LCbb-rCSXV7WW-KrB851COuA1ioNECdRgTc7JGCIiH1lhZU8h8k8NUDWWx8d5FbteRD~Jbsswpug__"
                alt="Store Logo"
                className="h-24"
              />
            </div>
            <h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm leading-relaxed">
              We're dedicated to providing the best shopping experience with premium products
              and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Shop', 'About', 'Blog', 'Contact', 'FAQ', 'Shipping', 'Returns'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Mail size={16} />
                <span className="text-sm">support@yourstore.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={16} />
                <span className="text-sm">123 Commerce St, City, State 12345</span>
              </li>
            </ul>
          </div>

          {/* Trust Badges */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">We Promise</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CreditCard size={20} />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center space-x-3">
                <Truck size={20} />
                <span className="text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield size={20} />
                <span className="text-sm">Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 rounded-l-md bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSubscribe}
                className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {currentYear} Your Store. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-sm hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
