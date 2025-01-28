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
	const [pageSize, setPageSize] = useState(10); // Default to 10
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
	}, [currentPage, pageSize, searchDescription]);
	// currentPage, pageSize, searchDescription

	// Handle the action of bulk deleting transactions which are selected
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
		setAddTransactionModal(true);
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
							className="block whitespace-pre-wrap group-hover:overflow-visible"
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
			render: (amount: string) =>
				`${(Number(amount) / 100).toLocaleString("hi")}`,
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
			render: (amountInINR: string) =>
				`₹${(Number(amountInINR) / 100).toLocaleString("hi")}`,
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
							onChange={(e) => {
								handleSearch(e.target.value);
								setCurrentPage(1);
								// setPageSize(10);
							}}
							className="w-full sm:w-auto max-w-xs sm:max-w-none"
						/>
						<Button
							type="dashed"
							icon={<AiFillDelete />}
							danger
							disabled={selectedIds.length === 0}
							onClick={() => handleBulkDelete()}
							className="w-full sm:w-auto max-w-xs sm:max-w-none"
						>
							Delete Selected
						</Button>
						<Button
							type="primary"
							icon={<AiFillDelete />}
							onClick={handleDeleteAll}
							danger
							disabled={totalTransactions === 0}
							className="w-full sm:w-auto max-w-xs sm:max-w-none"
						>
							Delete All
						</Button>
						<Button
							type="dashed"
							icon={<AiOutlineFileAdd />}
							onClick={handleAddTransaction}
							className="w-full sm:w-auto max-w-xs sm:max-w-none"
						>
							Add
						</Button>
						<Button
							type="primary"
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
						pageSizeOptions: [10, 20, 50],
						showSizeChanger: true,
						onChange: (page, size) => {
							// Calculate the new page number to keep the user on the same relative transactions
							const newPage = Math.ceil(((page - 1) * pageSize + 1) / size);

							// Update the state with the new page number and page size
							setCurrentPage(newPage);
							setPageSize(size);
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
