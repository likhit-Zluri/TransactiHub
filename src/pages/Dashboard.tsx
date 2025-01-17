import React from "react";
import Navbar from "../components/Navbar";
import TransactionTable from "../components/TransactionTable";

const Dashboard: React.FC = () => {
	return (
		<div>
			<Navbar />
			<div className="min-h-screen bg-gray-50 p-6">
				<TransactionTable />
			</div>
		</div>
	);
};

export default Dashboard;
