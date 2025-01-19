// import React, { useState } from "react";
// import {
// 	Modal,
// 	Button,
// 	Input,
// 	Select,
// 	InputNumber,
// 	DatePicker,
// 	Spin,
// 	notification,
// } from "antd";

// import moment from "moment";
// import { addTransaction } from "../services/operations/transactionsAPI";

// import { Transaction } from "../types/Transaction";
// import { Dropdown } from "primereact/dropdown";

// interface AddTransactionModalProps {
// 	setAddTransactionModal: (value: boolean) => void;
// 	onTransactionAdded: (transaction: Transaction) => void;
// }

// const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
// 	setAddTransactionModal,
// 	onTransactionAdded,
// }) => {
// 	const { Option } = Select;

// 	const [formData, setFormData] = useState({
// 		description: "",
// 		amount: null,
// 		date: "",
// 		currency: null,
// 	});

// 	const [errorMessages, setErrorMessages] = useState<string[]>([]);
// 	const [loading, setLoading] = useState(false);

// 	const currencyOptions = [
// 		{ label: "USD", value: "USD" },
// 		{ label: "EUR", value: "EUR" },
// 		{ label: "INR", value: "INR" },
// 		{ label: "GBP", value: "GBP" },
// 	];

// 	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		setFormData({ ...formData, [e.target.name]: e.target.value });
// 	};

// 	const handleSelectChange = (value: string, name: string) => {
// 		setFormData({ ...formData, [name]: value });
// 	};

// 	const handleDateChange = (date: moment.Moment | null, dateString: string) => {
// 		setFormData({ ...formData, date: dateString });
// 	};

// 	const validateForm = () => {
// 		const errors: string[] = [];
// 		if (!formData.description) errors.push("Description is required");
// 		if (formData.amount === null || formData.amount <= 0)
// 			errors.push("Amount is required and must be greater than zero");
// 		if (!formData.date) errors.push("Date is required");
// 		if (!formData.currency) errors.push("Currency is required");

// 		setErrorMessages(errors);
// 		return errors.length === 0;
// 	};

// 	const handleSave = async () => {
// 		if (!validateForm()) return;

// 		setLoading(true);

// 		const formattedDate = formData.date
// 			? formData.date.split("-").reverse().join("-")
// 			: null;

// 		const updatedFormData = { ...formData, date: formattedDate };

// 		try {
// 			const response = await addTransaction(updatedFormData);
// 			console.log("response in Add Transaction Modal", response);

// 			// Notify the parent component about the new transaction.
// 			onTransactionAdded(response.transaction);

// 			setAddTransactionModal(false);
// 			if (response.success === true) {
// 				notification.success({
// 					message: "Transaction Added",
// 					description: "Your transaction has been successfully added.",
// 				});
// 			} else if (response.success === false) {
// 				notification.error({
// 					message: "Error",
// 					description: "An error occurred while adding the transaction.",
// 				});
// 			}
// 		} catch (error) {
// 			console.error("Error adding transaction:", error);
// 			notification.error({
// 				message: "Error",
// 				description: "An error occurred while adding the transaction.",
// 			});
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return (
// 		<Modal
// 			title="Add Transaction"
// 			visible={true}
// 			onCancel={() => setAddTransactionModal(false)}
// 			footer={null}
// 			width={600}
// 			closable={false}
// 		>
// 			<div className="add-transaction-modal">
// 				{/* Description Field */}
// 				<div className="form-field">
// 					<Input
// 						placeholder="Enter description"
// 						name="description"
// 						value={formData.description}
// 						onChange={handleChange}
// 						className="ant-input"
// 						required
// 						disabled={loading}
// 					/>
// 					{errorMessages.includes("Description is required") && (
// 						<span className="text-red-500">Description is required</span>
// 					)}
// 				</div>

// 				{/* Currency Field */}
// 				<div className="form-field mt-3">
// 					<Select
// 						name="currency"
// 						placeholder="Select Currency"
// 						value={formData.currency}
// 						onChange={(value) => handleSelectChange(value, "currency")}
// 						className="w-full"
// 						disabled={loading}
// 					>
// 						{currencyOptions.map((option) => (
// 							<Option key={option.value} value={option.value}>
// 								{option.label}
// 							</Option>
// 						))}
// 					</Select>
// 					{errorMessages.includes("Currency is required") && (
// 						<span className="text-red-500">Currency is required</span>
// 					)}
// 				</div>

// 				{/* Amount Field */}
// 				<div className="form-field mt-3">
// 					<InputNumber
// 						placeholder="Enter Amount"
// 						name="amount"
// 						value={formData.amount}
// 						onChange={(value) => setFormData({ ...formData, amount: value })}
// 						className="w-full"
// 						min={1}
// 						required
// 						disabled={loading}
// 					/>
// 					{errorMessages.includes(
// 						"Amount is required and must be greater than zero"
// 					) && (
// 						<span className="text-red-500">
// 							Amount must be greater than zero
// 						</span>
// 					)}
// 				</div>

// 				{/* Date Field */}
// 				<div className="form-field mt-3">
// 					<DatePicker
// 						name="date"
// 						placeholder="Select Date"
// 						value={formData.date ? moment(formData.date, "YYYY-MM-DD") : null}
// 						onChange={handleDateChange}
// 						format="YYYY-MM-DD"
// 						className="w-full"
// 						disabled={loading}
// 					/>
// 					{errorMessages.includes("Date is required") && (
// 						<span className="text-red-500">Date is required</span>
// 					)}
// 				</div>

// 				{/* Loader */}
// 				{loading && (
// 					<div className="text-center mt-4">
// 						<Spin />
// 						<p>Processing Transaction...</p>
// 					</div>
// 				)}

// 				{/* Modal Footer */}
// 				<div className="modal-footer mt-4 text-center">
// 					<Button
// 						onClick={() => setAddTransactionModal(false)}
// 						disabled={loading}
// 					>
// 						Close
// 					</Button>
// 					<Button
// 						type="primary"
// 						onClick={handleSave}
// 						loading={loading}
// 						className="ml-2"
// 						disabled={loading}
// 					>
// 						Save
// 					</Button>
// 				</div>
// 			</div>
// 		</Modal>
// 	);
// };

// export default AddTransactionModal;

import React, { useState, useEffect } from "react";
import {
	Modal,
	Button,
	Input,
	Select,
	InputNumber,
	DatePicker,
	Spin,
	notification,
} from "antd";
import moment from "moment";
import {
	addTransaction,
	editTransaction,
} from "../services/operations/transactionsAPI"; // Include editTransaction API call
import { Transaction, TransactionInDB } from "../types/Transaction";

interface AddTransactionModalProps {
	setAddTransactionModal: (value: boolean) => void;
	onTransactionAdded: (transaction: Transaction) => void;
	transactionToEdit?: TransactionInDB; // Prop for editing an existing transaction
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
	setAddTransactionModal,
	onTransactionAdded,
	transactionToEdit,
}) => {
	const { Option } = Select;
	const [formData, setFormData] = useState({
		description: "",
		amount: null,
		date: "",
		currency: null,
	});

	const [errorMessages, setErrorMessages] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const currencyOptions = [
		{ label: "USD", value: "USD" },
		{ label: "EUR", value: "EUR" },
		{ label: "INR", value: "INR" },
		{ label: "GBP", value: "GBP" },
	];

	useEffect(() => {
		if (transactionToEdit) {
			// Pre-fill form data for editing
			setFormData({
				description: transactionToEdit.description,
				amount: transactionToEdit.amount / 100, // Assuming amount is in cents
				// date: moment(transactionToEdit.date).format("YYYY-MM-DD"),
				date: transactionToEdit.date.split("-").reverse().join("-"),
				currency: transactionToEdit.currency,
			});
		}
	}, [transactionToEdit]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSelectChange = (value: string, name: string) => {
		setFormData({ ...formData, [name]: value });
	};

	const handleDateChange = (date: moment.Moment | null, dateString: string) => {
		setFormData({ ...formData, date: dateString });
	};

	const validateForm = () => {
		const errors: string[] = [];
		if (!formData.description) errors.push("Description is required");
		if (formData.amount === null || formData.amount <= 0)
			errors.push("Amount is required and must be greater than zero");
		if (!formData.date) errors.push("Date is required");
		if (!formData.currency) errors.push("Currency is required");

		setErrorMessages(errors);
		return errors.length === 0;
	};

	const handleSave = async () => {
		if (!validateForm()) return;

		setLoading(true);

		const formattedDate = formData.date
			? formData.date.split("-").reverse().join("-")
			: null;

		const updatedFormData = { ...formData, date: formattedDate };

		try {
			let response;
			if (transactionToEdit) {
				// Edit existing transaction
				response = await editTransaction(transactionToEdit.id, updatedFormData);
			} else {
				// Add new transaction
				response = await addTransaction(updatedFormData);
			}

			console.log("response in Add/Edit Transaction Modal", response);

			// Notify the parent component about the added or edited transaction.
			onTransactionAdded(response.data.transaction);

			setAddTransactionModal(false);
			if (response.success === true) {
				notification.success({
					message: transactionToEdit
						? "Transaction Updated"
						: "Transaction Added",
					description: `Your transaction has been ${
						transactionToEdit ? "successfully updated" : "successfully added"
					}.`,
				});
			} else {
				notification.error({
					message: "Error",
					description: "An error occurred while processing the transaction.",
				});
			}
		} catch (error) {
			console.error("Error adding/editing transaction:", error);
			notification.error({
				message: "Error",
				description: "An error occurred while processing the transaction.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			title={transactionToEdit ? "Edit Transaction" : "Add Transaction"}
			visible={true}
			onCancel={() => setAddTransactionModal(false)}
			footer={null}
			width={600}
			closable={false}
		>
			<div className="add-transaction-modal">
				{/* Description Field */}
				<div className="form-field">
					<Input
						placeholder="Enter description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						className="ant-input"
						required
						disabled={loading}
					/>
					{errorMessages.includes("Description is required") && (
						<span className="text-red-500">Description is required</span>
					)}
				</div>

				{/* Currency Field */}
				<div className="form-field mt-3">
					<Select
						name="currency"
						placeholder="Select Currency"
						value={formData.currency}
						onChange={(value) => handleSelectChange(value, "currency")}
						className="w-full"
						disabled={loading}
					>
						{currencyOptions.map((option) => (
							<Option key={option.value} value={option.value}>
								{option.label}
							</Option>
						))}
					</Select>
					{errorMessages.includes("Currency is required") && (
						<span className="text-red-500">Currency is required</span>
					)}
				</div>

				{/* Amount Field */}
				<div className="form-field mt-3">
					<InputNumber
						placeholder="Enter Amount"
						name="amount"
						value={formData.amount}
						onChange={(value) => setFormData({ ...formData, amount: value })}
						className="w-full"
						min={1}
						required
						disabled={loading}
					/>
					{errorMessages.includes(
						"Amount is required and must be greater than zero"
					) && (
						<span className="text-red-500">
							Amount must be greater than zero
						</span>
					)}
				</div>

				{/* Date Field */}
				<div className="form-field mt-3">
					<DatePicker
						name="date"
						placeholder="Select Date"
						value={formData.date ? moment(formData.date, "YYYY-MM-DD") : null}
						onChange={handleDateChange}
						format="YYYY-MM-DD"
						className="w-full"
						disabled={loading}
					/>
					{errorMessages.includes("Date is required") && (
						<span className="text-red-500">Date is required</span>
					)}
				</div>

				{/* Loader */}
				{loading && (
					<div className="text-center mt-4">
						<Spin />
						<p>Processing Transaction...</p>
					</div>
				)}

				{/* Modal Footer */}
				<div className="modal-footer mt-4 text-center">
					<Button
						onClick={() => setAddTransactionModal(false)}
						disabled={loading}
					>
						Close
					</Button>
					<Button
						type="primary"
						onClick={handleSave}
						loading={loading}
						className="ml-2"
						disabled={loading}
					>
						{transactionToEdit ? "Save Changes" : "Save"}
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default AddTransactionModal;
