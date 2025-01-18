// import { useState } from "react";

import { transactionEndpoints } from "../api";
import { TransactionInput } from "../../types/Transaction";
import { apiConnector } from "../apiconnector";

const {
	ADDTRANSACTION_API,
	// EDITTRANSACTION_API,
	GETALLTRANSACTIONS_API,
	// DELETETRANSACTION_API,
	// UPLOADTRANSACTIONS_API,
	// DELETEALLTRANSACTIONS_API,
} = transactionEndpoints;

export function addTransaction(data: TransactionInput) {
	return async () => {
		try {
			// Assuming you're making an API call here
			const response = await fetch(ADDTRANSACTION_API, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Failed to add transaction");
			}
			const result = await response.json();
			return result;
			// Handle the success (e.g., refresh data or show a success message)
		} catch (error) {
			console.error("Error:", error);
		} finally {
			console.log("addTransaction done");
		}
	};
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
