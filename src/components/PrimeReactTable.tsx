import React, { useEffect, useState } from "react";
import { Transaction } from "../types/Transaction";
import { getAllTransaction } from "../services/operations/transactionsAPI";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

const TransactionTable1: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [loading, setLoading] = useState(false);
	const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
	const [totalTransactions, setTotalTransactions] = useState(0);
	const [selectedRows, setSelectedRows] = useState<Transaction[]>([]);

	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading(true);
			try {
				const response = await getAllTransaction({ currentPage, limit });
				setTransactionsList(response.transactions);
				setTotalTransactions(response.totalCount);
			} catch (error) {
				console.error("Error fetching transactions:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchTransactions();
	}, [currentPage, limit]);

	const totalPages = Math.ceil(totalTransactions / limit);

	const onSelectAll = (e: any) => {
		setSelectedRows(e.checked ? transactionsList : []);
	};

	const onRowSelect = (e: any) => setSelectedRows(e.data);
	const onRowUnselect = () => setSelectedRows([]);

	const actionTemplate = (rowData: Transaction) => (
		<div className="flex gap-2 justify-center">
			<Button
				label="Edit"
				icon="pi pi-pencil"
				className="p-button-text text-blue-500 hover:underline"
			/>
			<Button
				label="Delete"
				icon="pi pi-trash"
				className="p-button-text text-red-500 hover:underline"
			/>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-semibold text-gray-600">Transactions</h1>
					<div className="flex gap-4">
						<Button
							label="Upload CSV"
							icon="pi pi-upload"
							className="p-button-primary bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition "
						/>
						<Button
							label="Add Transaction"
							icon="pi pi-plus"
							className="p-button-success bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition"
						/>
					</div>
				</div>

				{/* Loading Screen */}
				{loading ? (
					<div className="flex justify-center items-center min-h-screen">
						<div className="animate-spin rounded-full border-t-4 border-blue-500 h-12 w-12"></div>
					</div>
				) : (
					<div className="overflow-x-auto min-w-full text-sm text-left text-gray-700 border border-gray-200">
						<DataTable
							value={transactionsList}
							rows={limit}
							totalRecords={totalTransactions}
							lazy
							first={(currentPage - 1) * limit}
							onPage={(e) => setCurrentPage(e.page + 1)}
							selection={selectedRows}
							onSelectionChange={onRowSelect}
							onRowUnselect={onRowUnselect}
							selectionMode="checkbox"
							emptyMessage="No transactions found."
							className="border-none"
							stripedRows
							rowHover
						>
							{/* Header Checkbox */}
							<Column
								body={(rowData) => (
									<Checkbox
										value={rowData.id}
										onChange={() => {}}
										checked={selectedRows.some((row) => row.id === rowData.id)}
										className="w-[50px] min-w-[50px]"
									/>
								)}
								header={
									<Checkbox
										onChange={onSelectAll}
										checked={selectedRows.length === transactionsList.length}
										className="w-[50px] min-w-[50px]"
									/>
								}
								style={{
									width: "3rem",
									textAlign: "center",
									border: "1px solid #E5E7EB",
									// padding: "8px",
								}}
								className="border border-gray-200"
							/>
							{/* Date Column */}
							<Column
								field="date"
								header="Date"
								sortable
								headerClassName="text-gray-600 border border-gray-200 uppercase"
								style={{
									textAlign: "left",
									border: "1px solid #E5E7EB",
									padding: "8px",
								}}
							/>
							{/* Description Column */}
							<Column
								field="description"
								header="Transaction Description"
								body={(rowData) =>
									rowData.description.length > 50
										? `${rowData.description.substring(0, 50)}...`
										: rowData.description
								}
								headerClassName="text-gray-600 border border-gray-200 uppercase"
								style={{
									textAlign: "left",
									border: "1px solid #E5E7EB",
									padding: "8px",
								}}
							/>
							{/* Amount Column */}
							<Column
								field="amount"
								header="Amount"
								body={(rowData) =>
									new Intl.NumberFormat("en-IN", {
										style: "currency",
										currency: "INR",
									}).format(rowData.amount)
								}
								headerClassName="text-gray-600 border border-gray-200 uppercase"
								style={{
									textAlign: "left",
									border: "1px solid #E5E7EB",
									padding: "8px",
								}}
							/>
							{/* Currency Column */}
							<Column
								field="currency"
								header="Currency"
								headerClassName="text-gray-600 border border-gray-200 uppercase"
								style={{
									textAlign: "left",
									border: "1px solid #E5E7EB",
									padding: "8px",
								}}
							/>
							{/* Amount in INR Column */}
							<Column
								field="amountInINR"
								header="Amount in INR"
								body={(rowData) =>
									new Intl.NumberFormat("en-IN", {
										style: "currency",
										currency: "INR",
									}).format(rowData.amountInINR)
								}
								headerClassName="text-gray-600 border border-gray-200 uppercase"
								style={{
									textAlign: "left",
									border: "1px solid #E5E7EB",
									padding: "8px",
								}}
							/>
							{/* Actions Column */}
							<Column
								body={actionTemplate}
								headerClassName="text-gray-600 border border-gray-200 uppercase"
								style={{
									textAlign: "center",
									border: "1px solid #E5E7EB",
									padding: "8px",
								}}
							/>
						</DataTable>
					</div>
				)}

				{/* Pagination */}
				<div className="flex justify-between items-center mt-6">
					<div>
						<label className="text-sm text-gray-500 mr-2">Rows per page:</label>
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
					<div className="text-sm text-gray-500">
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
		</div>
	);
};

export default TransactionTable1;
