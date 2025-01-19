import { transactionEndpoints } from "../api";
import { TransactionInput } from "../../types/Transaction";
import { apiConnector } from "../apiconnector";
import { UUID } from "crypto";

const {
	ADDTRANSACTION_API,
	// EDITTRANSACTION_API,
	GETALLTRANSACTIONS_API,
	DELETETRANSACTION_API,
	// UPLOADTRANSACTIONS_API,
	// DELETEALLTRANSACTIONS_API,
} = transactionEndpoints;

export async function addTransaction(data: TransactionInput) {
	try {
		console.log("before apiConnector");
		const res = await apiConnector({
			url: ADDTRANSACTION_API,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			bodyData: data,
		});

		console.log("res in addTransaction", res);
		if (res.data.success === false) {
			throw new Error("Failed to add transaction");
		}

		// return res.data;
	} catch (error) {
		console.error("Error:", error);
	} finally {
		console.log("addTransaction done");
	}
}

export async function getAllTransaction({
	currentPage,
	limit,
}: {
	currentPage: number;
	limit: number;
}) {
	try {
		// Construct query parameters using URLSearchParams
		const queryParams = `page=${currentPage.toString()}&limit=${limit.toString()}`;
		console.log("queryParams", queryParams);
		const url = `${GETALLTRANSACTIONS_API}?${queryParams}`;
		console.log("url", url);

		// Make a GET request with query parameters
		const res = await apiConnector({
			url,
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("res in getAllTransaction", res);
		if (res.data.success === false) {
			throw new Error("Failed to fetch transactions");
		}

		return res.data.data;
	} catch (error) {
		console.error("Error:", error);
	} finally {
		console.log("getAllTransaction done");
	}
}

export async function deleteTransaction({ id }: { id: UUID }) {
	try {
		// console.log("id", id, typeof id);
		// Ensure the URL includes the correct transaction ID
		const url = `${DELETETRANSACTION_API.replace(":id", id)}`;

		console.log("before apiConnector");
		const res = await apiConnector({
			url: url,
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		// console.log("res in deleteTransaction", res);
		if (res.data.success === false) {
			throw new Error("Failed to delete transaction");
		}

		return res.data;
	} catch (error) {
		console.error("Error deleting transaction:", error);
		// Handle errors gracefully
	} finally {
		console.log("deleteTransaction done");
	}
}
