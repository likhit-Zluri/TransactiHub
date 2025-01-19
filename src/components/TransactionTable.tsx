import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Modal, notification } from "antd";

import { TransactionInDB } from "../types/Transaction";

import {
	getPaginatedTransactions,
	deleteTransaction,
	editTransaction,
} from "../services/operations/transactionsAPI";

import { UUID } from "crypto";

import AddTransactionModal from "../modals/AddTransactionModal";
import UploadCSVModal from "../modals/UploadCSVmodal";

const TransactionTable: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1); // Default to 1
	const [limit, setLimit] = useState(10); // Default to 10

	const [loading, setLoading] = useState(false);

	const [transactionsList, setTransactionsList] = useState<TransactionInDB[]>(
		[]
	);
	const [totalTransactions, setTotalTransactions] = useState(0);

	const [addTransactionModal, setAddTransactionModal] = useState(false);
	const [uploadCSVModal, setUploadCSVModal] = useState(false);
	const [editingTransaction, setEditingTransaction] =
		useState<TransactionInDB | null>(null);

	const totalPages = Math.ceil(totalTransactions / limit);

	// Get paginated Transactions
	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading(true);
			try {
				const response = await getPaginatedTransactions(currentPage, limit);
				setTransactionsList(response.data.transactions);
				setTotalTransactions(response.data.totalCount);

				if (response.success === true) {
					notification.success({
						message: "Fetched Transactions",
						description: "Transactions have been successfully loaded.",
					});
				} else if (response.success === false) {
					notification.error({
						message: "Error Fetching Transactions",
						description: "An error occurred while fetching the transactions.",
					});
				}
			} catch (error) {
				console.error("Error fetching transactions:", error);
				notification.error({
					message: "Error",
					description: "An error occurred while fetching the transactions.",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, [currentPage, limit]);

	// Handle delete button click
	const handleDelete = async (transactionId: UUID) => {
		Modal.confirm({
			title: "Are you sure you want to delete this transaction?",
			onOk: async () => {
				try {
					const res = await deleteTransaction(transactionId);
					console.log("res in handleDelete", res);
					// If successful, filter out the deleted transaction from the list
					setTransactionsList((prevList) =>
						prevList.filter((transaction) => transaction.id !== transactionId)
					);

					notification.success({
						message: "Transaction Deleted",
						description: "The transaction has been deleted successfully.",
					});
				} catch (error) {
					console.error("Error deleting transaction:", error);
					notification.error({
						message: "Error Deleting Transaction",
						description: "An error occurred while deleting the transaction.",
					});
				}
			},
			onCancel() {
				// Optional: Handle cancel event (nothing to do in this case)
				console.log("Delete action canceled.");
			},
		});
	};

	const handleAddTransaction = () => {
		setEditingTransaction(null);
		setAddTransactionModal(true);
	};

	// Add or Update Transaction here changes
	// const handleTransactionAddedOrUpdated = (newTransaction: TransactionInDB) => {
	// 	console.log("newTransaction", newTransaction);

	// 	if (editingTransaction) {
	// 		// Update the transaction in the list
	// 		setTransactionsList((prevList) =>
	// 			prevList.map((transaction) =>
	// 				transaction.id === newTransaction.id ? newTransaction : transaction
	// 			)
	// 		);
	// 	} else {
	// 		// Add new transaction to the list
	// 		setTransactionsList((prevList) => [newTransaction, ...prevList]);
	// 		setTotalTransactions((prev) => prev + 1);
	// 	}
	// 	setAddTransactionModal(false); // Close the modal
	// };

	const handleTransactionAddedOrUpdated = (newTransaction: TransactionInDB) => {
		console.log("newTransaction", newTransaction);

		setTransactionsList((prevList) => {
			const updatedList = editingTransaction
				? prevList.map((transaction) =>
						transaction.id === newTransaction.id ? newTransaction : transaction
				  )
				: [newTransaction, ...prevList];

			// Sort the transactions in descending order by date
			return updatedList.sort(
				(a, b) =>
					new Date(b.date.split("-").reverse().join("-")).getTime() -
					new Date(a.date.split("-").reverse().join("-")).getTime()
			);
		});

		if (!editingTransaction) {
			setTotalTransactions((prev) => prev + 1);
		}

		setAddTransactionModal(false); // Close the modal
	};

	// Edit Transaction - Sets the transaction to be edited
	const handleEditTransaction = (transaction: TransactionInDB) => {
		console.log("transaction in handleEditTransaction", transaction);
		setEditingTransaction(transaction); // Set the transaction to be edited
		console.log(
			"editingTransaction in handleEditTransaction",
			editingTransaction
		);
		setAddTransactionModal(true); // Open modal for editing
	};

	const handleCSVUpload = () => {
		console.log("handleCSVUpload");
		setUploadCSVModal(true);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-semibold text-gray-700">Transactions</h1>
					<div className="flex space-x-4">
						<Button
							label="Upload CSV"
							icon="pi pi-upload"
							className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
							onClick={handleCSVUpload} // Open the dialog
						></Button>
						<Button
							label="Add Transaction"
							icon="pi pi-plus"
							className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
							onClick={handleAddTransaction} // Open the dialog
						></Button>
					</div>
				</div>

				{/* Loading Screen */}
				{loading ? (
					<div className="flex justify-center items-center min-h-screen">
						<div className="animate-spin rounded-full border-t-4 border-blue-500 h-12 w-12"></div>
					</div>
				) : (
					// Table
					<div className="overflow-x-auto">
						<table className="min-w-full text-sm text-left text-gray-700 border border-gray-200">
							<thead className="bg-gray-100 text-gray-600 uppercase">
								<tr>
									<th className="p-3 border border-gray-200 w-[50px] min-w-[50px]">
										<input type="checkbox" className="rounded" />
									</th>
									<th className="p-3 border border-gray-200 w-[120px] min-w-[100px]">
										Date
									</th>
									<th className="p-3 border border-gray-200 w-[300px] min-w-[200px]">
										Transaction Description
									</th>
									<th className="p-3 border border-gray-200 w-[150px] min-w-[120px]">
										Amount
									</th>
									<th className="p-3 border border-gray-200 w-[120px] min-w-[100px]">
										Currency
									</th>
									<th className="p-3 border border-gray-200 w-[150px] min-w-[120px]">
										Amount in INR
									</th>
									<th className="p-3 border border-gray-200 w-[150px] min-w-[120px]">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{transactionsList.map((transaction, index) => (
									<tr
										key={transaction.id}
										className={`${
											index % 2 === 0 ? "bg-gray-50" : "bg-white"
										} hover:bg-gray-100 transition`}
									>
										<td className="p-3 border border-gray-200">
											<input type="checkbox" className="rounded" />
										</td>
										<td className="p-3 border border-gray-200">
											{transaction.date}
										</td>
										<td className="p-3 border border-gray-200">
											{transaction.description.length > 50
												? `${transaction.description.substring(0, 50)}...`
												: transaction.description}
										</td>
										<td className="p-3 border border-gray-200">
											{Number(transaction.amount) / 100}
										</td>
										<td className="p-3 border border-gray-200">
											{transaction.currency}
										</td>
										<td className="p-3 border border-gray-200">
											{Number(transaction.amountInINR) / 100}
										</td>
										<td className="p-3 border border-gray-200 flex space-x-2">
											<button
												className="text-blue-500 hover:underline"
												onClick={() => handleEditTransaction(transaction)}
											>
												Edit
											</button>
											<button
												className="text-red-500 hover:underline"
												onClick={() => handleDelete(transaction.id)}
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{/* Pagination */}
				<div className="flex justify-between items-center mt-6">
					<div>
						<label className="text-sm text-gray-600 mr-2">Rows per page:</label>
						<select
							value={limit}
							onChange={(e) => setLimit(Number(e.target.value))}
							className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
						>
							{[10, 25, 50].map((value) => (
								<option key={value} value={value}>
									{value}
								</option>
							))}
						</select>
					</div>
					<div className="text-sm text-gray-600">
						Page {currentPage} of {totalPages}
					</div>
					<div className="flex space-x-2">
						<button
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
							className={`text-blue-500 hover:text-blue-700 transition ${
								currentPage === 1 && "opacity-50 cursor-not-allowed"
							}`}
						>
							Prev
						</button>
						<button
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
							className={`text-blue-500 hover:text-blue-700 transition ${
								currentPage === totalPages && "opacity-50 cursor-not-allowed"
							}`}
						>
							Next
						</button>
					</div>
				</div>
			</div>

			{/* Add/Edit Transaction Dialog */}
			{addTransactionModal && (
				<AddTransactionModal
					setAddTransactionModal={setAddTransactionModal}
					onTransactionAdded={handleTransactionAddedOrUpdated}
					transactionToEdit={editingTransaction} // Pass the editing transaction
				/>
			)}

			{/* Upload CSV Dialog */}
			{uploadCSVModal && (
				<UploadCSVModal setUploadCSVModal={setUploadCSVModal} />
			)}
		</div>
	);
};

export default TransactionTable;
