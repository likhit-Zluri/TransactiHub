import React from "react";

const Navbar: React.FC = () => {
	return (
		<div className="bg-blue-600 text-white p-4 shadow-md">
			<div className="max-w-6xl mx-auto flex justify-between items-center">
				<h1 className="text-2xl font-semibold">TransactiHub</h1>
				<div className="flex items-center space-x-4">
					<div className="text-sm">
						<span>Welcome to BUG BASH,</span>
						<span className="font-semibold">Zluri Intern</span>
					</div>
					<div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
						<span className="font-semibold">ZI</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
