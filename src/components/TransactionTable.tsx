import React, { useState, useEffect } from "react";
import {
	AiFillDelete,
	AiOutlineCloudUpload,
	AiOutlineEdit,
	AiOutlineFileAdd,
} from "react-icons/ai";
import { Checkbox, Modal, notification, Table, Button } from "antd";

import {
	AntUiTransaction,
	TransactionFromDB,
	UUID,
} from "../types/Transaction";
import {
	getPaginatedTransactions,
	deleteTransaction,
	deleteMultipleTransactions,
} from "../services/operations/transactionsAPI";
import AddTransactionModal from "../modals/AddTransactionModal";
import EditTransactionModal from "../modals/EditTransactionModal";
import UploadCSVModal from "../modals/UploadCSVmodal";

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
		useState<TransactionFromDB>();
	// const [deleting, setDeleting] = useState(false);

	const [headerCheckbox, setHeaderCheckbox] = useState(false);

	const [selectedIds, setSelectedIds] = useState<UUID[]>([]);

	// const [editingTransaction, setEditingTransaction] = useState<
	// 	dataSourceType | undefined
	// >(undefined);

	// const totalPages = Math.ceil(totalTransactions / pageSize);

	// Fetch transactions
	const fetchTransactions = async () => {
		setLoading(true);
		try {
			const response = await getPaginatedTransactions(currentPage, pageSize);
			console.log({response})
			if (response) {
				setTransactionsList(response.data.transactions);
				setTotalTransactions(response.data.totalCount);
			}
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchTransactions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, pageSize]);

	// Handle single transaction delete
	const handleDelete = async (transactionId: UUID) => {
		Modal.confirm({
			title: "Are you sure you want to delete this transaction?",
			onOk: async () => {
				const res = await deleteTransaction(transactionId);
				console.log("res in handleDelete", res);
				setTransactionsList((prevList) =>
					prevList.filter((transaction) => transaction.id !== transactionId)
				);
				notification.success({
					message: "Transaction Deleted",
					description: "The transaction has been deleted successfully.",
				});
			},
		});
	};

	// Handle the action of bulk deleting transactions
	const handleBulkDelete = () => {
		Modal.confirm({
			title: "Are you sure you want to delete the selected transactions?",
			onOk: async () => {
				console.log("selectedIds", selectedIds);

				await deleteMultipleTransactions(selectedIds);

				setSelectedIds([]);
				setHeaderCheckbox(false);

				await fetchTransactions();
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
		console.log("in handleTransactionAdded");

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

	const handleCSVUploaded = async () => {
		await fetchTransactions();
	};

	const columns = [
		{
			title: (
				<Checkbox
					checked={headerCheckbox}
					onChange={(e) => handleHeaderCheckboxChange(e.target.checked)}
				/>
			), // Header checkbox
			dataIndex: "checkbox",
			key: "checkbox",
			render: (_: unknown, record: { id: UUID }) => (
				<Checkbox
					checked={selectedIds.includes(record.id)}
					onChange={(e) => handleRowCheckboxChange(record.id, e.target.checked)}
				/>
			), // Render a checkbox in each row
			width: 1,
		},
		{
			title: "Date",
			dataIndex: "date",
			key: "date",
			width: 90,
		},
		{
			title: "Transaction Description",
			dataIndex: "description",
			key: "description",
			width: 300,
			render: (text: string) => {
				// Substring the description to the first 50 characters
				const truncatedText =
					text.length > 50 ? `${text.substring(0, 47)}...` : text;

				const handleCopy = (description: string) => {
					navigator.clipboard
						.writeText(description)
						.then(() => {
							notification.success({
								message: "Copied!",
								description:
									"The transaction description has been copied to your clipboard.",
							});
						})
						.catch(() => {
							notification.error({
								message: "Copy Failed",
								description: "Failed to copy the description.",
							});
						});
				};

				return (
					<div className="relative group cursor-pointer">
						<span
							className="block truncate group-hover:truncate-none group-hover:whitespace-normal group-hover:overflow-visible"
							title={text} // Full description as tooltip on hover
							onDoubleClick={() => handleCopy(text)} // Trigger copy on double-click
						>
							{truncatedText}
						</span>
					</div>
				);
			},
		},
		{
			title: "Amount",
			dataIndex: "amount",
			key: "amount",
			render: (amount: string) => `${amount}`,
			width: 1,
		},
		{
			title: "Currency",
			dataIndex: "currency",
			key: "currency",
			width: 1,
		},
		{
			title: "Amount in INR",
			dataIndex: "amountInINR",
			key: "amountInINR",
			render: (amountInINR: string) => `₹${amountInINR}`,
			width: 102,
		},
		{
			title: "Actions",
			key: "actions",
			render: (_: unknown, record: AntUiTransaction, index: number) => (
				<div className="flex space-x-2">
					<Button
						type="primary"
						icon={<AiOutlineEdit />}
						className="bg-blue-500 hover:bg-blue-600 text-white"
						onClick={() => handleEditTransaction(transactionsList[index])}
					>
						Edit
					</Button>
					<Button
						type="primary"
						icon={<AiFillDelete />}
						className="bg-red-500 hover:bg-red-600 text-white"
						onClick={() => handleDelete(record.id)}
					>
						Delete
					</Button>
				</div>
			),
			width: 1,
		},
	];

	const handleHeaderCheckboxChange = (checked: boolean) => {
		setHeaderCheckbox(checked);
		setSelectedIds(checked ? transactionsList.map((tx) => tx.id) : []);
	};

	const handleRowCheckboxChange = (id: UUID, checked: boolean) => {
		console.log("selectedIds", selectedIds);

		setSelectedIds((prev) => {
			if (checked) return [...prev, id];
			return prev.filter((selectedId) => selectedId !== id);
		});
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-semibold text-gray-700">Transactions</h1>
					<div className="flex space-x-4">
						<Button
							type="primary"
							icon={<AiFillDelete />}
							danger
							disabled={selectedIds.length === 0}
							onClick={() => handleBulkDelete()}
						>
							Delete Selected
						</Button>

						<Button
							key="upload"
							type="primary"
							icon={<AiOutlineCloudUpload />}
							onClick={handleCSVUpload}
							className="bg-green-500 hover:bg-green-600 text-white border-green-500"
						>
							Upload CSV
						</Button>
						<Button
							type="primary"
							icon={<AiOutlineFileAdd />}
							onClick={handleAddTransaction}
							className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
						>
							Add Transaction
						</Button>
					</div>
				</div>

				{/* Loading Screen */}
				{loading ? (
					<div className="flex flex-col justify-center items-center min-h-screen">
						<div className="mb-4">Loading...</div>
						<div
							className="animate-spin rounded-full border-t-4 border-blue-500 h-12 w-12"
							// role="status"
						></div>
					</div>
				) : (
					<Table
						dataSource={transactionsList.map((transaction) => ({
							key: transaction.id,
							id: transaction.id,
							date: transaction.date,
							description:
								// transaction.description.length > 47
								// 	? `${transaction.description.substring(0, 47)}...`
								// 	:
								transaction.description,
							amount: transaction.amount / 100,
							currency: transaction.currency,
							amountInINR: transaction.amountInINR / 100,
						}))}
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
						rowClassName={() => {
							return "h-[60px] overflow-hidden"; // Apply Tailwind classes directly here
						}}
					/>
				)}

				{/* Pagination */}
				{/* <div className="flex justify-between items-center mt-6">
					{totalTransactions}
				</div> */}
			</div>

			{/* Add Transaction Modal */}
			{addTransactionModal && (
				<AddTransactionModal
					setAddTransactionModal={setAddTransactionModal}
					onTransactionAdded={handleTransactionAdded}
				/>
			)}

			{/* Edit Transaction Modal */}
			{editTransactionModal && editingTransaction != undefined && (
				<EditTransactionModal
					setEditTransactionModal={setEditTransactionModal}
					onTransactionUpdated={handleTransactionEdited}
					transactionToEdit={editingTransaction}
				/>
			)}

			{/* Upload CSV Modal */}
			{uploadCSVModal && (
				<UploadCSVModal
					setUploadCSVModal={setUploadCSVModal}
					onCSVUploaded={handleCSVUploaded}
				/>
			)}
		</div>
	);
};

export default TransactionTable;
