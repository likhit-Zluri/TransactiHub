// services/api.ts
import axios from "axios";

const API_URL = process.env.BACKEND_URL;

if (!API_URL) {
	throw new Error("API URL is not defined in the .env file.");
}

export const fetchTransactions = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data; // Assuming the backend returns an array of transactions
	} catch (error) {
		console.error("Error fetching transactions:", error);
		throw error; // You can handle errors as needed
	}
};
