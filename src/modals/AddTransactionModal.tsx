// import React, { useState } from "react";
// import { Modal, Button, Input, Select, InputNumber, Form } from "antd";
// import { addTransaction } from "../services/operations/transactionsAPI";
// import { TransactionFromDB, TransactionInput } from "../types/Transaction";
// import { dateFormatter } from "../utils/dateFormatter";

// const currencyOptions = [
// 	{ label: "USD", value: "USD" },
// 	{ label: "EUR", value: "EUR" },
// 	{ label: "INR", value: "INR" },
// 	{ label: "GBP", value: "GBP" },
// ];

// interface AddTransactionModalProps {
// 	setAddTransactionModal: (value: boolean) => void;
// 	onTransactionAdded: (transaction: TransactionFromDB) => void;
// }

// const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
// 	setAddTransactionModal,
// 	onTransactionAdded,
// }) => {
// 	const [form] = Form.useForm();
// 	const [loading, setLoading] = useState(false);

// 	const handleSave = async (values: TransactionInput) => {
// 		console.log("in handleSave");

// 		setLoading(true);
// 		try {
// 			const updatedFormData = {
// 				...values,
// 				date: dateFormatter(values.date),
// 			};

// 			const response = await addTransaction(updatedFormData);
// 			const addedTransaction = response.data.transaction;
// 			onTransactionAdded(addedTransaction);
// 			setAddTransactionModal(false);
// 		} catch (error) {
// 			console.error("Error adding transaction:", error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleClose = () => {
// 		setAddTransactionModal(false);
// 	};

// 	return (
// 		<Modal
// 			title="Add a Transaction"
// 			open={true}
// 			onCancel={handleClose}
// 			footer={null}
// 		>
// 			<Form
// 				form={form}
// 				layout="vertical"
// 				onFinish={handleSave}
// 				initialValues={{
// 					description: "",
// 					amount: 0,
// 					date: "",
// 					currency: currencyOptions[0].value,
// 				}}
// 			>
// 				<Form.Item
// 					label="Description"
// 					name="description"
// 					rules={[{ required: true, message: "Description is required." }]}
// 				>
// 					<Input placeholder="Enter description" disabled={loading} />
// 				</Form.Item>

// 				<Form.Item
// 					label="Amount"
// 					name="amount"
// 					rules={[
// 						{ required: true, message: "Amount is required." },
// 						{
// 							type: "number",
// 							min: 1,
// 							message: "Amount must be greater than zero.",
// 						},
// 					]}
// 				>
// 					<InputNumber
// 						type="number"
// 						placeholder="Enter amount"
// 						className="w-full"
// 						disabled={loading}
// 						onKeyDown={(e) => {
// 							if (e.key === "e" || e.key === "E") {
// 								e.preventDefault();
// 							}
// 						}}
// 					/>
// 				</Form.Item>

// 				<Form.Item
// 					label="Date"
// 					name="date"
// 					rules={[{ required: true, message: "Date is required." }]}
// 				>
// 					<Input type="date" disabled={loading} />
// 				</Form.Item>

// 				<Form.Item
// 					label="Currency"
// 					name="currency"
// 					rules={[{ required: true, message: "Currency is required." }]}
// 				>
// 					<Select placeholder="Select currency" disabled={loading}>
// 						{currencyOptions.map((option) => (
// 							<Select.Option key={option.value} value={option.value}>
// 								{option.label}
// 							</Select.Option>
// 						))}
// 					</Select>
// 				</Form.Item>

// 				<Form.Item>
// 					<div className="modal-footer">
// 						<Button onClick={handleClose} disabled={loading}>
// 							Close
// 						</Button>
// 						<Button
// 							aria-label="add-save-button"
// 							type="primary"
// 							htmlType="submit"
// 							loading={loading}
// 							className="ml-2"
// 						>
// 							Save
// 						</Button>
// 					</div>
// 				</Form.Item>
// 			</Form>
// 		</Modal>
// 	);
// };

// export default AddTransactionModal;

import React, { useState } from "react";
import { Modal, Button, Input, Select, InputNumber, Form } from "antd";
import { addTransaction } from "../services/operations/transactionsAPI";
import { TransactionFromDB } from "../types/Transaction";
import { dateFormatter } from "../utils/dateFormatter";

const currencyOptions = [
	{ label: "USD", value: "USD" },
	{ label: "EUR", value: "EUR" },
	{ label: "INR", value: "INR" },
	{ label: "GBP", value: "GBP" },
];

interface FormDataInterface {
	description: string;
	amount: number;
	date: string;
	currency: string;
}
// interface ErrorInterface {
// 	description: string;
// 	amount: string;
// 	date: string;
// 	currency: string;
// }
interface EditTransactionModalProps {
	setAddTransactionModal: (value: boolean) => void;
	onTransactionAdded: () => void;
}

const AddTransactionModal: React.FC<EditTransactionModalProps> = ({
	setAddTransactionModal,
	onTransactionAdded,
}) => {
	const [formData, setFormData] = useState<FormDataInterface>({
		amount: 1,
		description: "",
		date: "",
		currency: currencyOptions[0].value,
	});
	const [errors, setErrors] = useState<{
		description?: string;
		amount?: string;
		date?: string;
		currency?: string;
	}>({});

	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === "date") {
			const selectedDate = new Date(value);
			const today = new Date();
			today.setHours(0, 0, 0, 0); // Normalize time for accurate comparison

			if (value === "") {
				// If the user clicks but types nothing
				setErrors({ ...errors, date: "Date is required." });
				setFormData({ ...formData, date: "" }); // Reset date to an empty string
			} else if (isNaN(selectedDate.getTime())) {
				// Check if the date is invalid, e.g., "30 Feb 2024"
				setErrors({ ...errors, date: "Invalid date. Please check the value." });
				setFormData({ ...formData, date: "" }); // Reset date to an empty string
			} else if (selectedDate > today) {
				// Check for future dates
				setErrors({ ...errors, date: "Future dates are not allowed." });
				setFormData({ ...formData, date: "" }); // Reset date to an empty string
			} else {
				// Valid date
				setErrors({ ...errors, date: "" }); // Clear error
				setFormData({ ...formData, date: value });
			}
		} else if (name === "description") {
			// Handle description validation
			if (value.length > 255) {
				setErrors({
					...errors,
					description:
						"Description must be less than or equal to 255 characters.",
				});
				setFormData({ ...formData, description: "" });
			} else if (value === "") {
				setErrors({
					...errors,
					description: "Description is required.",
				});
			} else {
				setErrors({ ...errors, description: "" }); // Clear error when length is valid
				setFormData({ ...formData, description: value });
			}
		} else {
			// Handle other fields
			if (value === "") {
				setErrors({
					...errors,
					[name]: `${
						name.charAt(0).toUpperCase() + name.slice(1)
					} is required.`,
				});
			} else {
				setErrors({ ...errors, [name]: "" }); // Clear error for valid input
			}
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleAmountChange = (value: number | null) => {
		if (isNaN(Number(value))) {
			setErrors({ ...errors, amount: "Amount is required." });
			setFormData({ ...formData, amount: 1 });
		} else if (value === null || value <= 0) {
			setErrors({ ...errors, amount: "Amount must be greater than zero." });
			setFormData({ ...formData, amount: 1 }); // Reset to default value
		} else {
			setErrors({ ...errors, amount: "" });
			setFormData({ ...formData, amount: value });
		}
	};

	const handleCurrencyChange = (value: string) => {
		if (!currencyOptions.some((option) => option.value === value)) {
			setErrors({ ...errors, currency: "Invalid currency selected." });
			setFormData((prevState) => ({
				...prevState,
				currency: currencyOptions[0].value,
			})); // Reset to default currency
		} else {
			setErrors({ ...errors, currency: "" });
			setFormData({ ...formData, currency: value });
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (value === "") {
			setErrors({
				...errors,
				[name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
			});
		}
	};

	const validateForm = (): boolean => {
		const newErrors: typeof errors = {};
		console.log("formData", formData);

		if (!formData.description)
			newErrors.description = "Description is required.";
		if (formData.amount === null || formData.amount <= 0)
			newErrors.amount = "Amount must be greater than zero.";
		if (!formData.date) newErrors.date = "Date is required.";
		if (!formData.currency) newErrors.currency = "Currency is required.";

		setErrors(newErrors);
		console.log("newErrors", newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const isFormValid = (): boolean => {
		if (!formData.date) return false;

		const selectedDate = new Date(formData.date);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return (
			formData.description.trim() !== "" && // Check for a non-empty description
			formData.amount > 0 && // Ensure amount is greater than 0
			!isNaN(selectedDate.getTime()) && // Validate date format
			selectedDate <= today && // Ensure date is not in the future
			!!formData.currency && // Check if currency is selected
			!Object.values(errors).some((error) => error) // Ensure no errors in the form
		);
	};

	const handleSave = async () => {
		console.log("in save");
		if (!validateForm()) return;
		console.log("in save");
		setLoading(true);
		try {
			const { ...rest } = formData;
			const updatedFormData = {
				...formData,
				date: dateFormatter(formData.date),
			};
			console.log("formdata", rest, updatedFormData);

			const response = await addTransaction(updatedFormData);
			console.log(response);
			const editedTransaction: TransactionFromDB = response.data.transaction;
			console.log("editedTransaction", editedTransaction);

			// const updatedDataSourceType: dataSourceType = {
			// 	key: editedTransaction.id,
			// 	...editedTransaction,
			// };
			// console.log("updatedDataSourceType",updatedDataSourceType)
			onTransactionAdded();

			setAddTransactionModal(false);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = async () => {
		setAddTransactionModal(false);
	};

	return (
		<Modal
			title="Add a Transaction"
			open={true}
			onCancel={handleClose}
			footer={null}
		>
			<Form layout="vertical" initialValues={formData}>
				<Form.Item
					label={
						<span>
							Description{" "}
							<span style={{ color: "gray", fontSize: "12px" }}>
								(up to 255 characters)
							</span>
						</span>
					}
				>
					<Input
						placeholder="Enter description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						disabled={loading}
						onBlur={handleBlur}
					/>
					{errors.description && (
						<p className="text-red-500">{errors.description}</p>
					)}
				</Form.Item>

				<Form.Item
					label={
						<span>
							Amount{" "}
							<span style={{ color: "gray", fontSize: "12px" }}>
								(up to 2 decimals, no negative values)
							</span>
						</span>
					}
				>
					<InputNumber
						type="number"
						placeholder="Enter amount"
						value={formData.amount}
						onChange={handleAmountChange}
						onBlur={handleBlur}
						disabled={loading}
						className="w-full"
					/>

					{errors.amount && <p className="text-red-500">{errors.amount}</p>}
				</Form.Item>

				<Form.Item
					label={
						<span>
							Date{" "}
							<span style={{ color: "gray", fontSize: "12px" }}>
								(no future dates)
							</span>
						</span>
					}
				>
					<Input
						type="date"
						id="date-input"
						name="date"
						placeholder="Enter date"
						value={formData.date}
						onChange={handleChange}
						onBlur={handleBlur}
						disabled={loading}
						onClick={(e) => {
							(e.target as HTMLInputElement).showPicker();
						}}
					/>

					{errors.date && <p className="text-red-500">{errors.date}</p>}
				</Form.Item>

				<Form.Item label="Currency">
					<Select
						placeholder="Select currency"
						value={formData.currency}
						onChange={handleCurrencyChange}
						onBlur={handleBlur}
						disabled={loading}
					>
						{currencyOptions.map((option) => (
							<Select.Option key={option.value} value={option.value}>
								{option.label}
							</Select.Option>
						))}
					</Select>
					{errors.currency && <p className="text-red-500">{errors.currency}</p>}
				</Form.Item>

				{/* Footer Buttons */}
				<Form.Item>
					<div className="modal-footer">
						<Button
							aria-label="add-close-button"
							onClick={handleClose}
							disabled={loading}
						>
							Close
						</Button>
						<Button
							aria-label="add-save-button"
							type="primary"
							loading={loading}
							htmlType="submit"
							className="ml-2"
							onClick={handleSave}
							disabled={!isFormValid() || loading} // Disable the button if form is invalid or loading
						>
							Save
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddTransactionModal;
