// mock/analytics.mock.js

const generateSalesData = (count = 1000) => {
  const salesData = [];
  for (let i = 0; i < count; i++) {
    salesData.push({
      date: `2025-${(i % 12 + 1).toString().padStart(2, '0')}-${((i % 31) + 1).toString().padStart(2, '0')}`,
      sales: Math.floor(Math.random() * 500) + 50, // sales between 50 and 550
      revenue: Math.floor(Math.random() * 10000) + 500, // revenue between 500 and 10500
    });
  }
  return salesData;
};

const generateUserData = (count = 1000) => {
  const userNames = ["Alice Johnson", "Bob Smith", "Catherine Lee", "David Brown", "Eva White", "Frank Green"];
  const locations = ["New York, US", "Los Angeles, US", "London, UK", "Berlin, DE", "Paris, FR"];
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const randomName = userNames[Math.floor(Math.random() * userNames.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    users.push({
      name: randomName,
      purchases: Math.floor(Math.random() * 100) + 5, // purchases between 5 and 105
      location: randomLocation,
    });
  }

  return users;
};

const generateCategoryData = (count = 50) => {
  const categories = [];
  for (let i = 0; i < count; i++) {
    categories.push({
      name: `Category-${i + 1}`,
      sales: Math.floor(Math.random() * 2000) + 100, // sales between 100 and 2100
      regionSales: {
        US: Math.floor(Math.random() * 1000),
        EU: Math.floor(Math.random() * 700),
        Asia: Math.floor(Math.random() * 500),
      },
      monthlySales: Math.floor(Math.random() * 500) + 20,
      yearlySales: Math.floor(Math.random() * 15000) + 500,
    });
  }
  return categories;
};

const generateProductData = (count = 200) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    products.push({
      name: `Product-${i + 1}`,
      sales: Math.floor(Math.random() * 500) + 30, // sales between 30 and 530
      regionSales: {
        US: Math.floor(Math.random() * 250),
        EU: Math.floor(Math.random() * 200),
        Asia: Math.floor(Math.random() * 150),
      },
    });
  }
  return products;
};

const generateMonthlySalesData = (count = 12) => {
  const monthlySalesData = [];
  for (let i = 0; i < count; i++) {
    monthlySalesData.push({
      month: `2025-${(i + 1).toString().padStart(2, '0')}`,
      sales: Math.floor(Math.random() * 10000) + 2000, // sales between 2000 and 12000
      revenue: Math.floor(Math.random() * 50000) + 5000, // revenue between 5000 and 55000
    });
  }
  return monthlySalesData;
};

const generateWeeklySalesData = (count = 52) => {
  const weeklySalesData = [];
  for (let i = 0; i < count; i++) {
    weeklySalesData.push({
      week: `2025-W${(i + 1).toString().padStart(2, '0')}`,
      sales: Math.floor(Math.random() * 2000) + 500, // sales between 500 and 2500
      revenue: Math.floor(Math.random() * 10000) + 1000, // revenue between 1000 and 11000
    });
  }
  return weeklySalesData;
};

const analyticsMock = {
  analyticsData: {
    users: 1250,
    products: 420,
    totalSales: 105800,
    totalRevenue: 7234500,
  },
  dailySalesData: generateSalesData(1000), // 1000 days of sales data
  monthlySalesData: generateMonthlySalesData(12), // 12 months data
  yearlySalesData: [
    { year: "2024", sales: 12000, revenue: 180000 },
    { year: "2025", sales: 105800, revenue: 7234500 },
  ],
  weeklySalesData: generateWeeklySalesData(52), // 52 weeks data
  topCategories: generateCategoryData(50), // 50 categories
  topUsers: generateUserData(1000), // 1000 users
  popularProducts: generateProductData(200), // 200 products
  
  // **Chart Data Structures for Compatibility**
  chartData: {
    // For Line Chart - Monthly sales over time
    lineChartData: {
      labels: [...Array(12).keys()].map(i => `Month ${i+1}`),
      datasets: [
        {
          label: "Sales ($)",
          data: generateMonthlySalesData(12).map(data => data.sales),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
        {
          label: "Revenue ($)",
          data: generateMonthlySalesData(12).map(data => data.revenue),
          fill: false,
          borderColor: "rgba(153, 102, 255, 1)",
          tension: 0.1,
        },
      ],
    },
  
    // For Bar Graph - Sales by category
    barChartData: {
      labels: generateCategoryData(50).map(item => item.name),
      datasets: [
        {
          label: "Sales",
          data: generateCategoryData(50).map(item => item.sales),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },

    // For Pie Chart - Category sales distribution
    pieChartData: {
      labels: ["Electronics", "Apparel", "Home Goods", "Other"],
      datasets: [
        {
          data: [500, 300, 250, 700],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 205, 86, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    
    // Geographical map Data (e.g., top user data by region)
    geographicalMapData: [
      { region: "US", value: 200, lat: 37.7749, lng: -122.4194 }, // San Francisco
      { region: "UK", value: 150, lat: 51.5074, lng: -0.1278 }, // London
      { region: "FR", value: 100, lat: 48.8566, lng: 2.3522 },  // Paris
      { region: "DE", value: 80, lat: 52.52, lng: 13.4050 },    // Berlin
    ],
    
    // For a radar chart of category comparison
    radarChartData: {
      labels: ["Electronics", "Apparel", "Home Goods"],
      datasets: [
        {
          label: "2024 Sales",
          data: [400, 500, 300],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "2025 Sales",
          data: [500, 300, 250],
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
  }
};

export default analyticsMock;
