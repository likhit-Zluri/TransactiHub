import { transactionEndpoints } from "../api";
import { TransactionInput } from "../../types/Transaction";
import { apiConnector } from "../apiconnector";
import { UUID } from "crypto";

import { notification } from "antd";
import { AxiosError } from "axios";

const {
	ADDTRANSACTION_API,
	EDITTRANSACTION_API,
	GETPAGINATEDTRANSACTIONS_API,
	DELETETRANSACTION_API,
	UPLOADTRANSACTIONS_API,
	// DELETEALLTRANSACTIONS_API,
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
			duration: 2,
		});

		return res.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while Adding transactions",
				description: `${error.response.data.message}`,
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
			duration: 2,
		});

		return res.data;
	} catch (error: unknown) {
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while Editing transactions",
				description: `${error.response.data.message}`,
			});
		}
		console.error("Error in editTransaction:", error);
	}
};

export async function getPaginatedTransactions(
	currentPage: number,
	limit: number
) {
	try {
		// Construct query parameters using URLSearchParams
		const queryParams = {
			page: currentPage.toString(),
			limit: limit.toString(),
		};
		const searchParams = new URLSearchParams(queryParams);

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
			duration: 2,
		});
		return res.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while fetching transactions",
				description: `${error.response.data.message}`,
			});
		}
		console.error("Error in getPaginatedTransactions:", error);
	}
	// finally {
	// 	console.log("getAllTransaction done");
	// }
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
			duration: 2,
		});

		return res.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while Deleting transactions",
				description: `${error.response.data.message}`,
			});
		}
		console.error("Error while Deleting transaction:", error);
	}
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
			duration: 3,
		});

		// return res.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response) {
			notification.error({
				message: "Error while Uploading Transactions",
				description: `${error.response.data.message}`,
			});
		}
		console.error("Error in uploadTransaction:", error);
	}
}
