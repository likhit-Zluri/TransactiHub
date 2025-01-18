import React, { useEffect, useState } from "react";
import { Transaction } from "../types/Transaction";
import { getAllTransaction } from "../services/operations/transactionsAPI";

const TransactionTable: React.FC = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [loading, setLoading] = useState(false);
	const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
	const [totalTransactions, setTotalTransactions] = useState(0);

	useEffect(() => {
		const fetchTransactions = async () => {
			setLoading(true);
			try {
				const response = await getAllTransaction({
					currentPage,
					limit,
				});
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

	// Helper to create pagination range
	const getPaginationPages = () => {
		const pages = [];
		if (currentPage > 2) pages.push(1); // Always include the first page
		if (currentPage > 3) pages.push("..."); // Ellipsis for skipped pages
		if (currentPage > 1) pages.push(currentPage - 1); // Previous page
		pages.push(currentPage); // Current page
		if (currentPage < totalPages) pages.push(currentPage + 1); // Next page
		if (currentPage < totalPages - 2) pages.push("..."); // Ellipsis for skipped pages
		if (currentPage < totalPages - 1) pages.push(totalPages); // Always include the last page
		return pages;
	};

	const paginationPages = getPaginationPages();

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-semibold text-gray-700">Transactions</h1>
					<div className="flex space-x-4">
						<button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition">
							Upload CSV
						</button>
						<button className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition">
							Add Transaction
						</button>
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
						<table className="w-full text-sm text-left text-gray-700 border border-gray-200">
							<thead className="bg-gray-100 text-gray-600 uppercase">
								<tr>
									<th className="p-3 border border-gray-200">
										<input type="checkbox" className="rounded" />
									</th>
									<th className="p-3 border border-gray-200">Date</th>
									<th className="p-3 border border-gray-200">
										Transaction Description
									</th>
									<th className="p-3 border border-gray-200">Amount</th>
									<th className="p-3 border border-gray-200">Currency</th>
									<th className="p-3 border border-gray-200">Amount in INR</th>
									<th className="p-3 border border-gray-200">Actions</th>
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
											{transaction.description}
										</td>
										<td className="p-3 border border-gray-200">
											{transaction.amount}
										</td>
										<td className="p-3 border border-gray-200">
											{transaction.currency}
										</td>
										<td className="p-3 border border-gray-200">
											{transaction.amountInINR}
										</td>
										<td className="p-3 border border-gray-200 flex space-x-2">
											<button className="text-blue-500 hover:underline">
												Edit
											</button>
											<button className="text-red-500 hover:underline">
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
					<div className="flex space-x-2 text-sm text-gray-600">
						{paginationPages.map((page, index) =>
							page === "..." ? (
								<span key={index} className="px-2">
									...
								</span>
							) : (
								<button
									key={index}
									onClick={() => setCurrentPage(Number(page))}
									className={`px-2 ${
										page === currentPage
											? "text-blue-600 font-bold"
											: "text-gray-600 hover:underline"
									}`}
								>
									{page}
								</button>
							)
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TransactionTable;
