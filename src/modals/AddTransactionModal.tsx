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
	description: string | undefined;
	amount: number | null;
	date: string | undefined;
	currency: string;
}
interface ErrorInterface {
	description?: string;
	amount?: string;
	date?: string;
	currency?: string;
}
interface AddTransactionModalProps {
	setAddTransactionModal: (value: boolean) => void;
	onTransactionAdded: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
	setAddTransactionModal,
	onTransactionAdded,
}) => {
	const [formData, setFormData] = useState<FormDataInterface>({
		amount: null,
		description: undefined,
		date: undefined,
		currency: currencyOptions[0].value,
	});
	const [errors, setErrors] = useState<ErrorInterface>({});

	const [loading, setLoading] = useState(false);

	const validateForm = (newData: FormDataInterface): boolean => {
		const newErrors: ErrorInterface = {};

		if (newData.description === undefined || newData.description.trim() == "")
			newErrors.description = "Description is required.";
		else if (newData.description.length > 255)
			newErrors.description =
				"Description must be less than or equal to 255 characters.";

		if (newData.amount === null) newErrors.amount = "Amount is required.";
		else if (newData.amount <= 0)
			newErrors.amount = "Amount must be greater than zero";

		// let selectedDate: Date;
		// if (newData.date !== undefined) selectedDate = new Date(newData.date);

		const today = new Date();
		if (newData.date !== undefined)
			console.log("today", today, new Date(newData.date));

		if (newData.date === undefined) newErrors.date = "Date is required.";
		else if (isNaN(new Date(newData.date).getTime()))
			newErrors.date = "Invalid Date.";
		else if (new Date(newData.date) > today)
			newErrors.date = "Future dates are not allowed.";

		if (newData.currency === "") newErrors.currency = "Currency is required.";
		else if (
			!currencyOptions.some((option) => option.value === newData.currency)
		) {
			newErrors.currency = "Invalid currency selected.";
		}

		setErrors(newErrors);
		console.log("formData", formData, errors, newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		const newData = { ...formData, [name]: value };

		setFormData(newData);
		// validateForm(newData);
	};

	// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const { name, value } = e.target;

	// 	if (name === "date") {
	// 		const selectedDate = new Date(value);
	// 		const today = new Date();
	// 		today.setHours(0, 0, 0, 0); // Normalize time for accurate comparison
	// 		console.log("value", value, selectedDate);

	// 		if (value === "") {
	// 			// If the user clicks but types nothing
	// 			setErrors({ ...errors, date: "Date is required." });
	// 			setFormData({ ...formData, date: "" }); // Reset date to an empty string
	// 		} else if (isNaN(selectedDate.getTime())) {
	// 			// Check if the date is invalid, e.g., "30 Feb 2024"
	// 			setErrors({ ...errors, date: "Invalid date. Please check the value." });
	// 			setFormData({ ...formData, date: "" }); // Reset date to an empty string
	// 		} else {
	// 			// Valid date
	// 			setErrors({ ...errors, date: "" }); // Clear error
	// 			setFormData({ ...formData, date: value });
	// 		}
	// 	} else if (name === "description") {
	// 		// Handle description validation
	// 		if (value.length > 255) {
	// 			setErrors({
	// 				...errors,
	// 				description:
	// 					"Description must be less than or equal to 255 characters.",
	// 			});
	// 			setFormData({ ...formData, description: "" });
	// 		} else if (value === "") {
	// 			setErrors({
	// 				...errors,
	// 				description: "Description is required.",
	// 			});
	// 			setFormData({ ...formData, description: "" });
	// 		} else {
	// 			setErrors({ ...errors, description: "" }); // Clear error when length is valid
	// 			setFormData({ ...formData, description: value });
	// 		}
	// 	}
	// 	// else {
	// 	// 	// Handle other fields
	// 	// 	if (value === "") {
	// 	// 		setErrors({
	// 	// 			...errors,
	// 	// 			[name]: `${
	// 	// 				name.charAt(0).toUpperCase() + name.slice(1)
	// 	// 			} is required.`,
	// 	// 		});
	// 	// 	} else {
	// 	// 		setErrors({ ...errors, [name]: "" }); // Clear error for valid input
	// 	// 	}
	// 	// 	setFormData({ ...formData, [name]: value });
	// 	// }
	// };

	const handleAmountChange = (value: number | null) => {
		console.log("handleAmountChange", value, typeof value);

		const newData = { ...formData, amount: value };
		setFormData(newData);
		// validateForm(newData);

		// if (value == null || isNaN(Number(value))) {
		// 	setErrors({ ...errors, amount: "Amount is required." });
		// 	setFormData({ ...formData, amount: null });
		// } else if (value === null || value <= 0) {
		// 	setErrors({ ...errors, amount: "Amount must be greater than zero." });
		// 	setFormData({ ...formData, amount: null }); // Reset to default value
		// } else {
		// 	setErrors({ ...errors, amount: "" });
		// 	setFormData({ ...formData, amount: value });
		// }
	};

	const handleCurrencyChange = (value: string) => {
		const newData = { ...formData, currency: value };

		setFormData(newData);
		// validateForm(newData);

		// if (!currencyOptions.some((option) => option.value === value)) {
		// 	setErrors({ ...errors, currency: "Invalid currency selected." });
		// 	setFormData((prevState) => ({
		// 		...prevState,
		// 		currency: currencyOptions[0].value,
		// 	})); // Reset to default currency
		// } else {
		// 	setErrors({ ...errors, currency: "" });
		// 	setFormData({ ...formData, currency: value });
		// }
	};

	// const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
	// 	const { name, value } = e.target;

	// 	if (value === "") {
	// 		setErrors({
	// 			...errors,
	// 			[name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`,
	// 		});
	// 	}
	// };

	// const validateForm = (): boolean => {
	// 	const newErrors: typeof errors = {};

	// 	if (formData.description === "")
	// 		newErrors.description = "Description is required.";
	// 	if (formData.amount === null || formData.amount <= 0)
	// 		newErrors.amount = "Amount must be greater than zero.";
	// 	if (formData.date === "") newErrors.date = "Date is required.";
	// 	if (!formData.currency) newErrors.currency = "Currency is required.";

	// 	setErrors(newErrors);
	// 	console.log("formData", formData, errors, newErrors);
	// 	return Object.keys(newErrors).length === 0;
	// };

	// const isFormValid = (): boolean => {
	// 	console.log("formdata", formData, errors);
	// 	if (
	// 		formData.date === "" ||
	// 		formData.description.trim() === "" ||
	// 		formData.amount === null ||
	// 		formData.currency === ""
	// 	)
	// 		return false;

	// 	const selectedDate = new Date(formData.date);
	// 	// const today = new Date();
	// 	// today.setHours(0, 0, 0, 0);

	// 	return (
	// 		Number(formData.amount) > 0 && // Ensure amount is greater than 0
	// 		!isNaN(selectedDate.getTime()) && // Validate date format
	// 		// selectedDate <= today && // Ensure date is not in the future
	// 		!Object.values(errors).some((error) => error) // Ensure no errors in the form
	// 	);
	// };

	const handleSave = async () => {
		console.log("in save");
		if (!validateForm(formData)) return;
		console.log("in save");
		setLoading(true);

		try {
			const updatedFormData = {
				...formData,
				date: dateFormatter(formData.date!),
				amount: Number(formData.amount),
				description: formData.description!.trim(),
			};
			console.log("formdata", formData, updatedFormData);

			const response = await addTransaction(updatedFormData);
			console.log(response);
			const addedTransaction: TransactionFromDB = response?.data?.transaction;
			console.log("addedTransaction", addedTransaction);

			// console.log("updatedDataSourceType",updatedDataSourceType)

			if (addedTransaction) {
				onTransactionAdded();
				setAddTransactionModal(false);
			}
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
						required
						value={formData.description}
						onChange={handleChange}
						disabled={loading}
						// onBlur={handleBlur}
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
						// onBlur={handleBlur}
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
						// onBlur={handleBlur}
						disabled={loading}
						max={new Date().toISOString().split("T")[0]}
						onClick={(e) => {
							(e.target as HTMLInputElement).showPicker();
						}}
						onKeyDown={(e) => e.preventDefault()}
					/>

					{errors.date && <p className="text-red-500">{errors.date}</p>}
				</Form.Item>

				<Form.Item label="Currency">
					<Select
						placeholder="Select currency"
						value={formData.currency}
						onChange={handleCurrencyChange}
						// onBlur={handleBlur}
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
							disabled={loading} // Disable the button if form is invalid or loading
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
