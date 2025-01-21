import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Checkbox, Modal, notification, Table } from "antd";
import { UUID } from "crypto";
import { TransactionFromDB } from "../types/Transaction";
import {
	getPaginatedTransactions,
	deleteTransaction,
} from "../services/operations/transactionsAPI";
import AddTransactionModal from "../modals/AddTransactionModal";
import EditTransactionModal from "../modals/EditTransactionModal";
import UploadCSVModal from "../modals/UploadCSVmodal";
import { dataSourceType } from "../types/Transaction";

const TransactionTable: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1); // Default to 1
	const [pageSize, SetPageSize] = useState(10); // Default to 10
	const [loading, setLoading] = useState(false);
	const [transactionsList, setTransactionsList] = useState<TransactionFromDB[]>(
		[]
	);
	const [totalTransactions, setTotalTransactions] = useState(0);
	const [addTransactionModal, setAddTransactionModal] = useState(false);
	const [editTransactionModal, setEditTransactionModal] = useState(false); // Add state for Edit Modal
	const [uploadCSVModal, setUploadCSVModal] = useState(false);
	const [editingTransaction, setEditingTransaction] =
		useState<dataSourceType>();

	// const [editingTransaction, setEditingTransaction] = useState<
	// 	dataSourceType | undefined
	// >(undefined);

	// const totalPages = Math.ceil(totalTransactions / pageSize);

	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading(true);
			try {
				const response = await getPaginatedTransactions(currentPage, pageSize);

				if (response && response.status !== 204) {
					setTransactionsList(response.data.transactions);
					setTotalTransactions(response.data.totalCount);
				}
			} catch (error) {
				console.error("Error fetching transactions:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, [currentPage, pageSize]);

	const handleDelete = async (transactionId: UUID) => {
		Modal.confirm({
			title: "Are you sure you want to delete this transaction?",
			onOk: async () => {
				try {
					const res = await deleteTransaction(transactionId);
					console.log("res in handleDelete", res);
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
		});
	};

	const handleAddTransaction = () => {
		setAddTransactionModal(true); // Open Add Transaction Modal
	};

	const handleEditTransaction = (transaction: TransactionFromDB) => {
		console.log("transaction", transaction);

		setEditingTransaction(transaction); // Set the transaction to be edited
		setEditTransactionModal(true); // Open Edit Transaction Modal
	};

	const handleTransactionAdded = (newTransaction: TransactionFromDB) => {
		setTransactionsList((prevList) => {
			// Add the new transaction
			const updatedList = [...prevList, newTransaction];

			// Sort transactions by date (most recent first)
			updatedList.sort(
				(a, b) =>
					new Date(b.parsedDate).getTime() - new Date(a.parsedDate).getTime()
			);

			// Check if the number of transactions exceeds the pageSize
			if (updatedList.length > pageSize) {
				// If so, slice the list to only keep the latest `pageSize` transactions
				return updatedList.slice(0, pageSize);
			}

			return updatedList;
		});
		setAddTransactionModal(false); // Close the modal after adding the transaction
	};

	const handleTransactionEdited = (updatedTransaction: TransactionFromDB) => {
		setTransactionsList((prevList) => {
			// Update the transaction in the list
			const updatedList = prevList.map((transaction) =>
				transaction.id === updatedTransaction.id
					? updatedTransaction
					: transaction
			);

			// Sort transactions by date (most recent first)
			updatedList.sort(
				(a, b) =>
					new Date(b.parsedDate).getTime() - new Date(a.parsedDate).getTime()
			);

			return updatedList;
		});

		setAddTransactionModal(false); // Close the modal after editing the transaction
	};

	const handleCSVUpload = () => {
		setUploadCSVModal(true); // Open Upload CSV Modal
	};

	const dataSource: dataSourceType[] = transactionsList.map((transaction) => ({
		key: transaction.id,
		id: transaction.id,
		date: transaction.date,
		description:
			transaction.description.length > 50
				? `${transaction.description.substring(0, 50)}...`
				: transaction.description,
		amount: transaction.amount / 100,
		currency: transaction.currency,
		amountInINR: transaction.amountInINR / 100,
	}));

	const columns = [
		{
			title: <Checkbox />, // Header checkbox
			dataIndex: "checkbox",
			key: "checkbox",
			render: () => <Checkbox />, // Render a checkbox in each row
			width: 50,
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			width: 120,
		},
		{
			title: "Transaction Description",
			dataIndex: "description",
			key: "description",
			width: 300,
		},
		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
			render: (amount: string) => `${amount}`,
			width: 150,
		},
		{
			title: "Currency",
			dataIndex: "currency",
			key: "currency",
			width: 120,
		},
		{
			title: "Amount in INR",
			dataIndex: "amountInINR",
			key: "amountInINR",
			render: (amountInINR: string) => `₹${amountInINR}`,
			width: 150,
		},
		{
			title: "Actions",
			key: "actions",
			render: (_: unknown, record: dataSourceType, index: number) => (
				<div className="flex space-x-2">
					<Button
						type="button"
						className="text-blue-500"
						onClick={() => handleEditTransaction(transactionsList[index])}
					>
						Edit
					</Button>
					<Button
						type="button"
						className="text-red-500"
						onClick={() => handleDelete(record.id)}
					>
						Delete
					</Button>
				</div>
			),
			width: 150,
		},
	];

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
						/>
						<Button
							label="Add Transaction"
							icon="pi pi-plus"
							className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
							onClick={handleAddTransaction} // Open the dialog
						/>
					</div>
				</div>

				{/* Loading Screen */}
				{loading ? (
					<div className="flex justify-center items-center min-h-screen">
						<div className="animate-spin rounded-full border-t-4 border-blue-500 h-12 w-12"></div>
					</div>
				) : (
					<Table
						dataSource={dataSource}
						columns={columns}
						pagination={{
							position: ["topCenter", "bottomCenter"],
							current: currentPage, // The current page
							pageSize: pageSize, // The current page size
							total: totalTransactions, // Total number of transactions
							showSizeChanger: true, // Allow page size changer
							pageSizeOptions: ["10", "20", "30"], // Available page sizes
							onChange: (page, pageSize) => {
								console.log("pagination", page, pageSize);
								setCurrentPage(page); // Update the current page
								SetPageSize(pageSize); // Update the page size
							},
						}}
						locale={{
							emptyText: "No transactions available.",
						}}
						scroll={{ x: "1000px" }}
					/>
				)}

				{/* Pagination */}
				<div className="flex justify-between items-center mt-6">
					{totalTransactions}
				</div>
			</div>

			{/* Add Transaction Modal */}
			{addTransactionModal && (
				<AddTransactionModal
					setAddTransactionModal={setAddTransactionModal}
					onTransactionAdded={handleTransactionAdded}
				/>
			)}

			{/* Edit Transaction Modal */}
			{editTransactionModal && (
				<EditTransactionModal
					setEditTransactionModal={setEditTransactionModal}
					onTransactionUpdated={handleTransactionEdited}
					transactionToEdit={editingTransaction}
				/>
			)}

			{/* Upload CSV Modal */}
			{uploadCSVModal && (
				<UploadCSVModal setUploadCSVModal={setUploadCSVModal} />
			)}
		</div>
	);
};

export default TransactionTable;
