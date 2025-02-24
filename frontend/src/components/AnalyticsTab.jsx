import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const AnalyticsTab = () => {
    const [analyticsData, setAnalyticsData] = useState({
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [dailySalesData, setDailySalesData] = useState([]);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await axios.get("/analytics");
                setAnalyticsData(response.data.analyticsData);
                setDailySalesData(response.data.dailySalesData);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                <AnalyticsCard title='Total Users' value={analyticsData.users.toLocaleString()} icon={Users} color='from-emerald-500 to-teal-700' />
                <AnalyticsCard title='Total Products' value={analyticsData.products.toLocaleString()} icon={Package} color='from-emerald-500 to-green-700' />
                <AnalyticsCard title='Total Sales' value={analyticsData.totalSales.toLocaleString()} icon={ShoppingCart} color='from-emerald-500 to-cyan-700' />
                <AnalyticsCard title='Total Revenue' value={`₹${analyticsData.totalRevenue.toLocaleString()}`} icon={DollarSign} color='from-emerald-500 to-lime-700' />
            </div>

            {/* Line Chart for Daily Sales & Revenue */}
            <ChartContainer title="Daily Sales & Revenue Trends">
                <ResponsiveContainer width='100%' height={400}>
                    <LineChart data={dailySalesData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' stroke='#D1D5DB' />
                        <YAxis yAxisId='left' stroke='#10B981' />
                        <YAxis yAxisId='right' orientation='right' stroke='#3B82F6' />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId='left' type='monotone' dataKey='sales' stroke='#10B981' activeDot={{ r: 8 }} name='Sales' />
                        <Line yAxisId='right' type='monotone' dataKey='revenue' stroke='#3B82F6' activeDot={{ r: 8 }} name='Revenue' />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>

            {/* Bar Chart for Sales & Revenue */}
            <ChartContainer title="Sales vs Revenue (Bar Chart)">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dailySalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#D1D5DB" />
                        <YAxis stroke="#D1D5DB" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#10B981" name="Sales" />
                        <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>

            {/* Area Chart for Revenue Trends */}
            <ChartContainer title="Revenue Trends (Area Chart)">
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={dailySalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#D1D5DB" />
                        <YAxis stroke="#D1D5DB" />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" name="Revenue" />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>

            {/* Pie Chart for Sales vs Revenue */}
            <ChartContainer title="Sales vs Revenue Distribution (Pie Chart)">
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie data={[
                            { name: "Total Sales", value: analyticsData.totalSales, fill: "#10B981" },
                            { name: "Total Revenue", value: analyticsData.totalRevenue, fill: "#3B82F6" }
                        ]}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                        />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
};

export default AnalyticsTab;

// Reusable Analytics Card Component
const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
    <motion.div className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className='flex justify-between items-center'>
            <div className='z-10'>
                <p className='text-emerald-300 text-sm mb-1 font-semibold'>{title}</p>
                <h3 className='text-white text-3xl font-bold'>{value}</h3>
            </div>
        </div>
        <div className='absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-30' />
        <div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
            <Icon className='h-32 w-32' />
        </div>
    </motion.div>
);

// Reusable Chart Container
const ChartContainer = ({ title, children }) => (
    <motion.div className='bg-gray-800/60 rounded-lg p-6 shadow-lg mb-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
    >
        <h2 className='text-white text-lg font-semibold mb-4'>{title}</h2>
        {children}
    </motion.div>
);
