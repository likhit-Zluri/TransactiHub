import React, { useState, useEffect } from "react";
import {
	AiFillDelete,
	AiOutlineCloudUpload,
	AiOutlineEdit,
	AiOutlineFileAdd,
} from "react-icons/ai";
import {
	Checkbox,
	Modal,
	notification,
	Table,
	Button,
	Input,
	// Menu,
	// Dropdown,
} from "antd";

import {
	AntUiTransaction,
	TransactionFromDB,
	UUID,
} from "../types/Transaction";
import {
	getPaginatedTransactions,
	// deleteTransaction,
	deleteMultipleTransactions,
	deleteAllTransactions,
} from "../services/operations/transactionsAPI";
import AddTransactionModal from "../modals/AddTransactionModal";
import EditTransactionModal from "../modals/EditTransactionModal";
import UploadCSVModal from "../modals/UploadCSVmodal";

// const { Search } = Input;

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

	// New state for search filters
	// const [searchDate, setSearchDate] = useState<string>("");
	const [searchDescription, setSearchDescription] = useState<string>("");

	// const [editingTransaction, setEditingTransaction] = useState<
	// 	dataSourceType | undefined
	// >(undefined);

	// const totalPages = Math.ceil(totalTransactions / pageSize);

	// Fetch transactions
	const fetchTransactions = async () => {
		setLoading(true);
		try {
			const response = await getPaginatedTransactions(
				currentPage,
				pageSize,
				searchDescription
			); // Pass search filters

			// console.log({ response });
			console.log("transaction", response);
			console.log("response.data", response.data);
			console.log("response.data.transactions", response.data.transactions);
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
	}, []);
	// currentPage, pageSize, searchDescription

	// Handle single transaction delete
	// const handleDelete = async (transactionId: UUID) => {
	// 	Modal.confirm({
	// 		title: "Are you sure you want to delete this transaction?",
	// 		content: (
	// 			<div data-testid="delete-confirmation-modal">
	// 				This action cannot be undone.
	// 			</div>
	// 		),
	// 		onOk: async () => {
	// 			const res = await deleteTransaction(transactionId);
	// 			console.log("res in handleDelete", res);
	// 			setTransactionsList((prevList) =>
	// 				prevList.filter((transaction) => transaction.id !== transactionId)
	// 			);
	// 			notification.success({
	// 				message: "Transaction Deleted",
	// 				description: "The transaction has been deleted successfully.",
	// 			});
	// 		},
	// 	});
	// };

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

	// Handle "Delete All" transactions
	const handleDeleteAll = () => {
		Modal.confirm({
			title: "Are you sure you want to delete all transactions?",
			content: "This action cannot be undone.",
			onOk: async () => {
				await deleteAllTransactions();
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

		setEditingTransaction(transaction);
		setEditTransactionModal(true);
	};

	const handleTransactionAdded = async () => {
		console.log("in handleTransactionAdded");
		await fetchTransactions();
	};

	const handleTransactionEdited = async () => {
		console.log("in handleTransactionEdited");
		await fetchTransactions();
	};

	const handleCSVUpload = () => {
		setUploadCSVModal(true);
	};

	const handleCSVUploaded = async () => {
		await fetchTransactions();
	};

	// Handle Menu Item Click for Export
	// const handleMenuClick = async (key: string) => {
	// 	console.log("Menu Item Clicked:", key);
	// 	if (key === "exportAll") {
	// 		// Logic to export all transactions
	// 		notification.info({
	// 			message: "Export All",
	// 			description: "You selected to export all transactions.",
	// 		});
	// 	} else if (key === "exportPage") {
	// 		// Logic to export the current page
	// 		notification.info({
	// 			message: "Export Page",
	// 			description: "You selected to export the current page of transactions.",
	// 		});
	// 	}
	// };

	// Define the items array with key-value pairs
	// const items = [
	// 	{
	// 		key: "exportAll",
	// 		label: <span>Export All</span>,
	// 	},
	// 	{
	// 		key: "exportPage",
	// 		label: <span>Export Page</span>,
	// 	},
	// ];

	const handleSearch = (value: string) => {
		setSearchDescription(value);
	};

	const columns = [
		{
			title: (
				<Checkbox
					name="header-checkbox"
					checked={headerCheckbox}
					onChange={(e) => handleHeaderCheckboxChange(e.target.checked)}
				/>
			), // Header checkbox
			dataIndex: "checkbox",
			key: "checkbox",
			render: (_: unknown, record: { id: UUID }) => (
				<Checkbox
					name={`checkbox-${record.id}`}
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
			render: (amount: string) => `${Number(amount) / 100}`,
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
			render: (amountInINR: string) => `₹${Number(amountInINR) / 100}`,
			width: 102,
		},
		{
			title: "Actions",
			key: "actions",
			render: (_: unknown, _record: AntUiTransaction, index: number) => (
				<div className="flex space-x-2">
					<Button
						type="primary"
						icon={<AiOutlineEdit />}
						className="bg-blue-500 hover:bg-blue-600 text-white"
						onClick={() => handleEditTransaction(transactionsList[index])}
					>
						Edit
					</Button>
					{/* <Button
						aria-label="single-delete"
						type="primary"
						icon={<AiFillDelete />}
						className="bg-red-500 hover:bg-red-600 text-white"
						onClick={() => handleDelete(record.id)}
					>
						Delete
					</Button> */}
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

	// return (
	// 	<div className="min-h-screen bg-gray-50 p-6">
	// 		<div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto">
	// 			{/* Header */}
	// 			<div className="flex justify-between items-center mb-6">
	// 				<h1 className="text-2xl font-semibold text-gray-700">Transactions</h1>
	// 				<div className="flex space-x-4">
	// 					{/* Export Dropdown */}
	// 					{/* <Dropdown
	// 						overlay={
	// 							<Menu items={items} onClick={(e) => handleMenuClick(e.key)} />
	// 						}
	// 					>
	// 						<Button className="flex items-center space-x-2">
	// 							<span>Export</span>
	// 							<AiOutlineCloudUpload />
	// 						</Button>
	// 					</Dropdown> */}
	// 					{/* Search Box for Date */}
	// 					{/* <Input
	// 						placeholder="Search by Date"
	// 						value={searchDate}
	// 						onChange={(e) => handleSearch(e.target.value, "date")}
	// 						className="w-40"
	// 					/> */}
	// 					{/* Search Box for Description */}
	// 					<Input
	// 						placeholder="Search by Description"
	// 						value={searchDescription}
	// 						onChange={(e) => handleSearch(e.target.value)}
	// 						className="w-50"
	// 					/>
	// 					<Button
	// 						type="primary"
	// 						icon={<AiFillDelete />}
	// 						danger
	// 						disabled={selectedIds.length === 0}
	// 						onClick={() => handleBulkDelete()}
	// 					>
	// 						Delete Selected
	// 					</Button>
	// 					<Button
	// 						type="primary"
	// 						icon={<AiFillDelete />}
	// 						danger
	// 						onClick={() => handleDeleteAll()}
	// 						disabled={totalTransactions === 0}
	// 					>
	// 						Delete All
	// 					</Button>
	// 					<Button
	// 						key="upload"
	// 						type="primary"
	// 						icon={<AiOutlineCloudUpload />}
	// 						onClick={handleCSVUpload}
	// 						className="bg-green-500 hover:bg-green-600 text-white border-green-500"
	// 					>
	// 						Upload CSV
	// 					</Button>
	// 					<Button
	// 						aria-label="add transaction"
	// 						type="primary"
	// 						icon={<AiOutlineFileAdd />}
	// 						onClick={handleAddTransaction}
	// 						className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
	// 					>
	// 						Add Transaction
	// 					</Button>
	// 				</div>
	// 			</div>

	// 			{/* Loading Screen */}
	// 			{loading ? (
	// 				<div className="flex flex-col justify-center items-center min-h-screen">
	// 					<div className="mb-4">Loading...</div>
	// 					<div
	// 						className="animate-spin rounded-full border-t-4 border-blue-500 h-12 w-12"
	// 						// role="status"
	// 					></div>
	// 				</div>
	// 			) : (
	// 				<Table
	// 					dataSource={
	// 						transactionsList &&
	// 						transactionsList.map((transaction) => ({
	// 							key: transaction.id,
	// 							id: transaction.id,
	// 							date: transaction.date,
	// 							description:
	// 								// transaction.description.length > 47
	// 								// 	? `${transaction.description.substring(0, 47)}...`
	// 								// 	:
	// 								transaction.description,
	// 							amount: transaction.amount / 100,
	// 							currency: transaction.currency,
	// 							amountInINR: transaction.amountInINR / 100,
	// 						}))
	// 					}
	// 					columns={columns}
	// 					pagination={{
	// 						position: ["topCenter", "bottomCenter"],
	// 						current: currentPage, // The current page
	// 						pageSize: pageSize, // The current page size
	// 						total: totalTransactions, // Total number of transactions
	// 						showSizeChanger: true, // Allow page size changer
	// 						pageSizeOptions: ["10", "20", "30"], // Available page sizes
	// 						onChange: (page, pageSize) => {
	// 							console.log("pagination", page, pageSize);
	// 							setCurrentPage(page); // Update the current page
	// 							SetPageSize(pageSize); // Update the page size
	// 						},
	// 						showTotal: (total, range) => {
	// 							// `range` will contain the current start and end range of records on the page
	// 							return `${range[0]}-${range[1]} of ${total}`;
	// 						},
	// 					}}
	// 					locale={{
	// 						emptyText: "No transactions available.",
	// 					}}
	// 					scroll={{ x: "1000px" }}
	// 					rowClassName={() => {
	// 						return "h-[60px] overflow-hidden"; // Apply Tailwind classes directly here
	// 					}}
	// 				/>
	// 			)}

	// 			{/* Pagination */}
	// 			{/* <div className="flex justify-between items-center mt-6">
	// 				{totalTransactions}
	// 			</div> */}
	// 		</div>

	// 		{/* Add Transaction Modal */}
	// 		{addTransactionModal && (
	// 			<AddTransactionModal
	// 				setAddTransactionModal={setAddTransactionModal}
	// 				onTransactionAdded={handleTransactionAdded}
	// 			/>
	// 		)}

	// 		{/* Edit Transaction Modal */}
	// 		{editTransactionModal && editingTransaction != undefined && (
	// 			<EditTransactionModal
	// 				setEditTransactionModal={setEditTransactionModal}
	// 				onTransactionUpdated={handleTransactionEdited}
	// 				transactionToEdit={editingTransaction}
	// 			/>
	// 		)}

	// 		{/* Upload CSV Modal */}
	// 		{uploadCSVModal && (
	// 			<UploadCSVModal
	// 				setUploadCSVModal={setUploadCSVModal}
	// 				onCSVUploaded={handleCSVUploaded}
	// 			/>
	// 		)}
	// 	</div>
	// );

	return (
		<div className="p-4 min-h-screen bg-gray-100">
			<div className="bg-white shadow-md rounded p-4">
				<div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0 gap-2">
					<h2 className="text-lg font-semibold text-center md:text-left">
						Transactions
					</h2>
					<div className="flex flex-wrap gap-2 justify-center md:justify-end w-full">
						<Input
							placeholder="Search by Description"
							value={searchDescription}
							onChange={(e) => handleSearch(e.target.value)}
							className="w-full sm:w-60"
						/>
						<Button
							icon={<AiFillDelete />}
							danger
							disabled={selectedIds.length === 0}
							onClick={() => handleBulkDelete()}
							className="w-full sm:w-auto max-w-xs sm:max-w-none"
						>
							Delete Selected
						</Button>
						<Button
							icon={<AiFillDelete />}
							onClick={handleDeleteAll}
							danger
							disabled={totalTransactions === 0}
							className="w-full sm:w-auto max-w-xs sm:max-w-none"
						>
							Delete All
						</Button>
						<Button
							icon={<AiOutlineFileAdd />}
							onClick={handleAddTransaction}
							className="w-full sm:w-auto max-w-xs sm:max-w-none"
						>
							Add
						</Button>
						<Button
							icon={<AiOutlineCloudUpload />}
							onClick={handleCSVUpload}
							className="w-full sm:w-auto max-w-xs sm:max-w-none"
						>
							Upload CSV
						</Button>
					</div>
				</div>

				<Table
					dataSource={transactionsList.map((transaction) => ({
						key: transaction.id,
						...transaction,
					}))}
					columns={columns}
					pagination={{
						current: currentPage,
						total: totalTransactions,
						pageSize,
						showSizeChanger: true,
						onChange: (page, size) => {
							setCurrentPage(page);
							SetPageSize(size);
						},
					}}
					loading={loading}
					scroll={{ x: true }}
				/>
			</div>

			{addTransactionModal && (
				<AddTransactionModal
					setAddTransactionModal={setAddTransactionModal}
					onTransactionAdded={handleTransactionAdded}
				/>
			)}
			{editTransactionModal && editingTransaction && (
				<EditTransactionModal
					setEditTransactionModal={setEditTransactionModal}
					transactionToEdit={editingTransaction}
					onTransactionUpdated={handleTransactionEdited}
				/>
			)}
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
