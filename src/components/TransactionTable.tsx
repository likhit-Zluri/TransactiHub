import React from "react";

interface Transaction {
	id: number;
	date: string;
	description: string;
	originalAmount: string;
	amountInINR: string;
}

const transactions: Transaction[] = Array.from({ length: 10 }).map(
	(_, index) => ({
		id: index + 1,
		date: "31/12/2022",
		description: "Lorem Ipsum Dolor Sit...",
		originalAmount: "$ 100",
		amountInINR: "₹ 8000",
	})
);

const TransactionTable: React.FC = () => {
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

				{/* Table */}
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
								<th className="p-3 border border-gray-200">Original Amount</th>
								<th className="p-3 border border-gray-200">Amount in INR</th>
								<th className="p-3 border border-gray-200">Actions</th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((transaction, index) => (
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
										{transaction.originalAmount}
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

				{/* Pagination */}
				<div className="flex justify-between items-center mt-6">
					<div>
						<p className="text-sm text-gray-600">Rows per page:</p>
						<select className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500">
							<option>10</option>
							<option>25</option>
							<option>50</option>
						</select>
					</div>
					<div className="text-sm text-gray-600">1-10 of 10</div>
					<div className="flex space-x-2">
						<button className="text-blue-500 hover:text-blue-700 transition">
							Prev
						</button>
						<button className="text-blue-500 hover:text-blue-700 transition">
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TransactionTable;
