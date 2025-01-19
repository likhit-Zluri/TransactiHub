// const BASE_URL = import.meta.env.VITE_BASE_URL;

// API endpoints
export const transactionEndpoints = {
	// Add a single transaction
	ADDTRANSACTION_API: "/transactions",

	// Edit a transaction
	EDITTRANSACTION_API: "/transactions/:id",

	// Get all transactions
	GETPAGINATEDTRANSACTIONS_API: "/transactions",

	// Delete a transaction
	DELETETRANSACTION_API: "/transactions/:id",

	// Add multiple transactions through CSV
	UPLOADTRANSACTIONS_API: "/transactions/upload",

	// Delete all transactions
	DELETEALLTRANSACTIONS_API: "/transactions",
};
