import { transactionEndpoints } from "../api";
import { TransactionInput } from "../../types/Transaction";
import { apiConnector } from "../apiconnector";
import { UUID } from "../../types/Transaction";
import { notification } from "antd";
import { AxiosError } from "axios";
import { generateCsvForErrors } from "../../utils/generateCSVForErrors";

const {
	ADDTRANSACTION_API,
	EDITTRANSACTION_API,
	GETPAGINATEDTRANSACTIONS_API,
	DELETETRANSACTION_API,
	UPLOADTRANSACTIONS_API,
	MULTIPLEDELETE_API,
	BULKDELETE_API,
	// GETSEARCH_API,
} = transactionEndpoints;

export async function addTransaction(data: TransactionInput) {
	try {
		const res = await apiConnector({
			url: ADDTRANSACTION_API,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			bodyData: data,
		});

		console.log("res in addTransaction", res);

		notification.success({
			message: "Transaction Added succesfully",
			duration: 1,
		});

		return res.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while Adding transactions",
				description: `${error.response.data.message}`,
				duration: 2,
			});
		}
		console.error("Error in addTransaction:", error);
	}
}

export const editTransaction = async (updatedData: {
	id: UUID;
	date: string;
	description: string;
	amount: number;
	currency: string;
}) => {
	try {
		console.log("updatedData", updatedData);
		// Ensure the URL includes the correct transaction ID as params
		const url = `${EDITTRANSACTION_API.replace(":id", updatedData.id)}`;
		const res = await apiConnector({
			url: url,
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			bodyData: updatedData,
		});

		console.log("res in editTransaction", res);
		notification.success({
			message: "Transaction Edited succesfully",
			duration: 1,
		});

		return res.data;
	} catch (error: unknown) {
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while Editing transactions",
				description: `${error.response.data.message}`,
				duration: 2,
			});
		}
		console.error("Error in editTransaction:", error);
	}
};

export async function getPaginatedTransactions(
	currentPage: number,
	limit: number,
	// date?: string, // Optional date parameter
	description?: string // Optional description parameter
) {
	try {
		// Construct query parameters using URLSearchParams
		const queryParams: Record<string, string> = {
			page: currentPage.toString(),
			limit: limit.toString(),
		};
		// Conditionally add the optional parameters if they are provided
		// if (date) queryParams.date = date;
		if (description) queryParams.search = description;

		const searchParams = new URLSearchParams(queryParams);

		// const url = `${GETPAGINATEDTRANSACTIONS_API}?${searchParams}`;

		const url = `${GETPAGINATEDTRANSACTIONS_API}?${searchParams}`;

		// Make a GET request with query parameters
		const res = await apiConnector({
			url,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		console.log("res in getPaginatedTransactions", res);

		notification.success({
			message: "Transactions Fetched successfully",
			description: res.data.message || "No Transactions found",
			duration: 1,
		});
		return res.data;
	} catch (error) {
		console.error("Error in getPaginatedTransactions:", error);
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while fetching transactions",
				description: `${error.response.data.message}`,
				duration: 2,
			});
		}
	}
}

export async function deleteTransaction(transactionId: UUID) {
	try {
		console.log("transactionId", transactionId, typeof transactionId);
		// Ensure the URL includes the correct transaction ID as params
		const url = `${DELETETRANSACTION_API.replace(":id", transactionId)}`;

		console.log("before apiConnector");
		const res = await apiConnector({
			url: url,
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		console.log("res in deleteTransaction", res);
		notification.success({
			message: "Transaction Deleted succesfully",
			duration: 1,
		});

		return res.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while Deleting transactions",
				description: `${error.response.data.message}`,
				duration: 2,
			});
		}
		console.error("Error while Deleting transaction:", error);
	}
}

interface ErrorDetail {
	index: number;
	msg: string;
}

interface ErrorResponse {
	validationErrors: ErrorDetail[];
	duplicationErrors: ErrorDetail[];
	existingTransaction: ErrorDetail[];
}

export async function uploadTransactions(
	file: File,
	skipCSVDuplicates: boolean = false
) {
	try {
		// Create a FormData object to handle the file upload
		const formData = new FormData();
		formData.append("file", file);
		formData.append("skipCSVDuplicates", skipCSVDuplicates.toString());

		const res = await apiConnector({
			url: UPLOADTRANSACTIONS_API,
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data", // Important to set for file uploads
			},
			bodyData: formData,
		});

		console.log("res in uploadTransaction", res);

		notification.success({
			message: "Transactions Uploaded Successfully",
			description: `${res.data.successCount} transactions were added successfully.`,
			duration: 1,
		});

		// return res.data;
	} catch (error) {
		if (
			error instanceof AxiosError &&
			error.response &&
			error.response.data.errors
		) {
			const {
				validationErrors,
				duplicationErrors,
				existingTransaction,
			}: ErrorResponse = error.response.data.errors || {};
			console.error("Validation Errors:", validationErrors);
			console.error("Duplication Errors:", duplicationErrors);
			console.error("Existing Transaction Errors:", existingTransaction);

			// Call the function to generate and download the CSVs in parallel
			await generateCsvForErrors(
				validationErrors,
				duplicationErrors,
				existingTransaction
			);

			// Show notification to the user
			notification.error({
				message: "Error while Uploading Transactions",
				description: `Some records failed validation, duplication, or already exist in the database. CSV files have been downloaded for each error type.`,
				duration: 3,
			});
		} else if (error instanceof AxiosError) {
			notification.error({
				message: "Error while Uploading Transactions",
				description: error.response?.data.message,
				duration: 3,
			});
		}
		console.error("Error in uploadTransaction:", error);
	}
}

export async function deleteMultipleTransactions(ids: UUID[]) {
	try {
		const res = await apiConnector({
			url: MULTIPLEDELETE_API,
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			bodyData: { ids },
		});

		console.log("res in deleteTransactions", res);

		notification.success({
			message: "Transactions Deleted succesfully",
			duration: 1,
		});

		return res.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while Deleting transactions",
				description: `${error.response.data.message}`,
				duration: 2,
			});
		}
		console.error("Error in deleteTransactions:", error);
	}
}

export async function deleteAllTransactions() {
	try {
		const res = await apiConnector({
			url: BULKDELETE_API,
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		console.log("res in deleteAllTransactions", res);

		notification.success({
			message: "All Transactions Deleted succesfully",
			duration: 1,
		});

		return res.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while All Deleting transactions",
				description: `${error.response.data.message}`,
				duration: 2,
			});
		}
		console.error("Error in All deleteTransactions:", error);
	}
}
