import React from "react";
import Navbar from "../components/Navbar";
import TransactionTable from "../components/TransactionTable";
// import TransactionTable1 from "../components/PrimeReactTable";

const Dashboard: React.FC = () => {
	return (
		<div>
			<Navbar />
			<div className="min-h-screen bg-gray-50 p-6">
				<TransactionTable />
				{/* <TransactionTable1 /> */}
			</div>
		</div>
	);
};

export default Dashboard;
