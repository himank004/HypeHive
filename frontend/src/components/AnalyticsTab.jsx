import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import _ from 'lodash';

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 13245,
    products: 1456,
    totalSales: 8239,
    totalRevenue: 1256529,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [topCategories, setTopCategories] = useState([
    { category: 'Electronics', sales: 3709 },
    { category: 'Fashion', sales: 2210 },
    { category: 'Home & Kitchen', sales: 945 },
    { category: 'Beauty', sales: 539 }
  ]);
  const [popularProducts, setPopularProducts] = useState([
    { name: 'Smartphone', sales: 934, returns: 42, active: 238, revenue: 51230 },
    { name: 'Laptop', sales: 732, returns: 30, active: 150, revenue: 42656 },
    { name: 'Washing Machine', sales: 520, returns: 25, active: 113, revenue: 34085 },
    { name: 'Headphones', sales: 642, returns: 35, active: 180, revenue: 21495 },
    { name: 'Sneakers', sales: 480, returns: 17, active: 212, revenue: 12930 }
  ]);

  const COLORS = ['#00C49F', '#00A7B5', '#008F7A'];

  useEffect(() => {
    // Replace this mock data fetch with a real API call
    const fetchAnalyticsData = async () => {
      try {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
          color="from-teal-400 to-violet-600"
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          color="from-pink-500 to-red-700"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="from-yellow-400 to-orange-600"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-indigo-500 to-blue-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top Categories Chart */}
        <SimpleCard title="Top Product Categories">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="category" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip />
              <Bar dataKey="sales" fill="#38b2ac" />
            </BarChart>
          </ResponsiveContainer>
        </SimpleCard>

        {/* Product Popularity */}
        <SimpleCard title="Product Popularity">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={popularProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="name" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip />
              <Bar dataKey="sales" fill="#00C49F" />
              <Bar dataKey="returns" fill="#FF5733" />
              <Bar dataKey="active" fill="#FFBD33" />
            </BarChart>
          </ResponsiveContainer>
        </SimpleCard>

        {/* Recent Products */}
        <SimpleCard title="Recent Products">
          <div className="overflow-auto max-h-[200px]">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-sm text-gray-300">Name</th>
                  <th className="text-left text-sm text-gray-300">Sales</th>
                  <th className="text-left text-sm text-gray-300">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {popularProducts.slice(0, 5).map((product, index) => (
                  <tr key={index}>
                    <td className="text-sm text-white">{product.name}</td>
                    <td className="text-sm text-white">{product.sales}</td>
                    <td className="text-sm text-white">${product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SimpleCard>

        {/* Category Distribution */}
        <SimpleCard title="Category Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={topCategories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="sales"
                label
              >
                {topCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </SimpleCard>
      </div>
    </div>
  );
};

const SimpleCard = ({ title, children }) => (
  <motion.div
    className="bg-gray-800 p-6 rounded-xl shadow-2xl text-white hover:shadow-3xl transition-shadow duration-300 ease-in-out"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h4 className="text-lg font-semibold text-gray-300 mb-4">{title}</h4>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className={`bg-gradient-to-r p-6 rounded-lg shadow-2xl text-white hover:shadow-3xl transition-shadow duration-300 ease-in-out ${color}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex items-center">
      <div className="mr-4 text-4xl text-opacity-90">
        <Icon />
      </div>
      <div>
        <h4 className="text-lg font-semibold text-opacity-80">{title}</h4>
        <p className="text-xl font-bold text-opacity-95">{value}</p>
      </div>
    </div>
  </motion.div>
);

export default AnalyticsTab;
