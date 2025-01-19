// import React, { useState } from "react";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { InputNumber } from "primereact/inputnumber";
// import { Calendar } from "primereact/calendar";
// import { Dropdown } from "primereact/dropdown";

// import { addTransaction } from "../services/operations/transactionsAPI";

// const AddTransactionModal = ({ setAddTransactionModal }) => {
// 	const [formData, setFormData] = useState({
// 		description: "",
// 		amount: 0,
// 		date: "", // Keep it as null initially
// 		currency: "",
// 	});

// 	const [errorMessages, setErrorMessages] = useState<string[]>([]);

// 	const currencyOptions = [
// 		{ label: "USD", value: "USD" },
// 		{ label: "EUR", value: "EUR" },
// 		{ label: "INR", value: "INR" },
// 		{ label: "GBP", value: "GBP" },
// 	];

// 	const handleChange = (e: any) => {
// 		setFormData({ ...formData, [e.target.name]: e.target.value });
// 	};

// 	const validateForm = () => {
// 		const errors: string[] = [];
// 		if (!formData.description) errors.push("Description is required");
// 		if (formData.amount === null) errors.push("Amount is required");
// 		if (!formData.date) errors.push("Date is required");
// 		if (!formData.currency) errors.push("Currency is required");

// 		setErrorMessages(errors);
// 		return errors.length === 0;
// 	};

// 	const handleSave = async () => {
// 		if (!validateForm()) return;

// 		const formattedDate = formData.date
// 			? new Date(formData.date)
// 					.toISOString()
// 					.split("T")[0]
// 					.split("-")
// 					.reverse()
// 					.join("-")
// 			: null;

// 		// Update formData with the formatted date
// 		const updatedFormData = { ...formData, date: formattedDate };

// 		const res = await addTransaction(updatedFormData);

// 		setAddTransactionModal(false);
// 	};

// 	return (
// 		<div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
// 			<div className="bg-white p-8 rounded-md shadow-lg max-w-lg w-full space-y-6">
// 				<div className="flex items-center justify-between">
// 					<h2 className="text-2xl font-semibold text-gray-800">
// 						Add Transaction
// 					</h2>
// 					<div className="flex space-x-4">
// 						<Button
// 							label="Close"
// 							icon="pi pi-times p-ml-2"
// 							onClick={() => setAddTransactionModal(false)}
// 							className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition"
// 							iconPos="left"
// 						/>
// 						<Button
// 							label="Save"
// 							icon="pi pi-save"
// 							onClick={handleSave}
// 							className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition"
// 							iconPos="left"
// 						/>
// 					</div>
// 				</div>

// 				<InputText
// 					placeholder="Enter description"
// 					id="description"
// 					name="description"
// 					value={formData.description}
// 					onChange={handleChange}
// 					className="p-inputtext w-full sm:w-3/4 mt-2 text-lg px-6 py-3 border border-gray-300 rounded-sm"
// 					required
// 					autoFocus
// 				/>

// 				<div className="flex gap-6">
// 					<Dropdown
// 						id="currency"
// 						name="currency"
// 						value={formData.currency}
// 						options={currencyOptions}
// 						onChange={handleChange}
// 						optionLabel="label"
// 						optionValue="value"
// 						placeholder="Currency"
// 						className="mt-2 w-full sm:w-3/4 text-lg px-6 py-3 border border-gray-300 rounded-md bg-opacity-50"
// 						required
// 					/>

// 					<InputNumber
// 						placeholder="Enter amount"
// 						id="amount"
// 						name="amount"
// 						value={formData.amount}
// 						onValueChange={(e) =>
// 							handleChange({ target: { name: "amount", value: e.value } })
// 						}
// 						className="p-inputnumber w-full sm:w-3/4 mt-2 text-lg px-6 py-3 border border-gray-300 rounded-md"
// 						required
// 					/>
// 				</div>

// 				<Calendar
// 					id="date"
// 					name="date"
// 					value={formData.date}
// 					onChange={(e) => setFormData({ ...formData, date: e.value })}
// 					dateFormat="dd/mm/yy"
// 					placeholder="DD/MM/YYYY"
// 					className="mt-2 text-lg px-6 py-3 border border-gray-300 rounded-md bg-opacity-100 w-full"
// 					required
// 				/>

// 				{errorMessages.length > 0 && (
// 					<div className="p-error mt-4 text-red-500">
// 						<ul className="list-disc pl-5">
// 							{errorMessages.map((msg, idx) => (
// 								<li key={idx}>{msg}</li>
// 							))}
// 						</ul>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// };

// export default AddTransactionModal;

import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";

import { addTransaction } from "../services/operations/transactionsAPI";

const AddTransactionModal = ({ setAddTransactionModal }) => {
	const [formData, setFormData] = useState({
		description: "",
		amount: 0,
		date: "", // Keep it as null initially
		currency: "",
	});

	const [errorMessages, setErrorMessages] = useState<string[]>([]);
	const [loading, setLoading] = useState(false); // Loading state

	const currencyOptions = [
		{ label: "USD", value: "USD" },
		{ label: "EUR", value: "EUR" },
		{ label: "INR", value: "INR" },
		{ label: "GBP", value: "GBP" },
	];

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validateForm = () => {
		const errors: string[] = [];
		if (!formData.description) errors.push("Description is required");
		if (formData.amount === null) errors.push("Amount is required");
		if (!formData.date) errors.push("Date is required");
		if (!formData.currency) errors.push("Currency is required");

		setErrorMessages(errors);
		return errors.length === 0;
	};

	const handleSave = async () => {
		if (!validateForm()) return;

		setLoading(true); // Start loading

		const formattedDate = formData.date
			? new Date(formData.date)
					.toISOString()
					.split("T")[0]
					.split("-")
					.reverse()
					.join("-")
			: null;

		// Update formData with the formatted date
		const updatedFormData = { ...formData, date: formattedDate };

		try {
			await addTransaction(updatedFormData);
			setAddTransactionModal(false);
		} catch (error) {
			console.error("Error adding transaction:", error);
		} finally {
			setLoading(false); // Stop loading
		}
	};

	return (
		<div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
			<div className="bg-white p-8 rounded-md shadow-lg max-w-lg w-full space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-semibold text-gray-800">
						Add Transaction
					</h2>
					<div className="flex space-x-4">
						<Button
							label="Close"
							icon="pi pi-times p-ml-2"
							onClick={() => setAddTransactionModal(false)}
							className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition"
							iconPos="left"
							disabled={loading} // Disable button when loading
						/>
						<Button
							label="Save"
							icon="pi pi-save"
							onClick={handleSave}
							className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition"
							iconPos="left"
							disabled={loading} // Disable button when loading
						/>
					</div>
				</div>

				<InputText
					placeholder="Enter description"
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					className="p-inputtext w-full sm:w-3/4 mt-2 text-lg px-6 py-3 border border-gray-300 rounded-sm"
					required
					autoFocus
					disabled={loading} // Disable input when loading
				/>

				<div className="flex gap-6">
					<Dropdown
						id="currency"
						name="currency"
						value={formData.currency}
						options={currencyOptions}
						onChange={handleChange}
						optionLabel="label"
						optionValue="value"
						placeholder="Currency"
						className="mt-2 w-full sm:w-3/4 text-lg px-6 py-3 border border-gray-300 rounded-md bg-opacity-50"
						required
						disabled={loading} // Disable dropdown when loading
					/>

					<InputNumber
						placeholder="Enter amount"
						id="amount"
						name="amount"
						value={formData.amount}
						onValueChange={(e) =>
							handleChange({ target: { name: "amount", value: e.value } })
						}
						className="p-inputnumber w-full sm:w-3/4 mt-2 text-lg px-6 py-3 border border-gray-300 rounded-md"
						required
						disabled={loading} // Disable input when loading
					/>
				</div>

				<Calendar
					id="date"
					name="date"
					value={formData.date}
					onChange={(e) => setFormData({ ...formData, date: e.value })}
					dateFormat="dd/mm/yy"
					placeholder="DD/MM/YYYY"
					className="mt-2 text-lg px-6 py-3 border border-gray-300 rounded-md bg-opacity-100 w-full"
					required
					disabled={loading} // Disable calendar when loading
				/>

				{loading && (
					<div className="text-center text-green-600 font-semibold">
						Adding Transaction...
					</div>
				)}

				{errorMessages.length > 0 && (
					<div className="p-error mt-4 text-red-500">
						<ul className="list-disc pl-5">
							{errorMessages.map((msg, idx) => (
								<li key={idx}>{msg}</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default AddTransactionModal;
