/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
	  extend: {
		colors: {
		  'dark-royalblue': '#003366', // Add dark royal blue color
		},
	  },
	},
	plugins: [],
  };
  