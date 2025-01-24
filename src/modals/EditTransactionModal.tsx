// EditTransactionModal.tsx
import React, { useState } from "react";
import { Modal, Button, Input, Select, InputNumber, Form } from "antd";
import { editTransaction } from "../services/operations/transactionsAPI";
import { TransactionFromDB, UUID } from "../types/Transaction";
import { dateFormatter } from "../utils/dateFormatter";

const currencyOptions = [
	{ label: "USD", value: "USD" },
	{ label: "EUR", value: "EUR" },
	{ label: "INR", value: "INR" },
	{ label: "GBP", value: "GBP" },
];

interface FormDataInterface {
	id: UUID;
	description: string;
	amount: number;
	date: string;
	currency: string;
}

interface EditTransactionModalProps {
	setEditTransactionModal: (value: boolean) => void;
	onTransactionUpdated: (transaction: TransactionFromDB) => void;
	transactionToEdit: TransactionFromDB;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
	setEditTransactionModal,
	onTransactionUpdated,
	transactionToEdit,
}) => {
	console.log("transactionToEdit", transactionToEdit);
	const [formData, setFormData] = useState<FormDataInterface>({
		...transactionToEdit,
		amount: transactionToEdit.amount / 100,
		date: dateFormatter(transactionToEdit.date),
	});
	// const [errorMessages, setErrorMessages] = useState<string[]>([]);
	const [errors, setErrors] = useState<{
		description?: string;
		amount?: string;
		date?: string;
		currency?: string;
	}>({});
	const [loading, setLoading] = useState(false);

	// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	setFormData({ ...formData, [e.target.name]: e.target.value });
	// };

	// const handleAmountChange = (value: number | null) => {
	// 	setFormData({ ...formData, amount: value || 0 });
	// };

	// const handleSelectChange = (value: string, name: string) => {
	// 	setFormData({ ...formData, [name]: value });
	// };

	// const validateForm = () => {
	// 	const errors: string[] = [];
	// 	if (!formData.description) errors.push("Description is required");
	// 	// if (formData.amount === null || formData.amount <= 0)
	// 	// 	errors.push("Amount must be greater than zero");
	// 	if (!formData.date) errors.push("Date is required");
	// 	if (!formData.currency) errors.push("Currency is required");

	// 	setErrorMessages(errors);

	// 	console.log("errorMessages", errorMessages);
	// 	return errors.length === 0;
	// };

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === "date") {
			const selectedDate = new Date(value);
			const today = new Date();
			today.setHours(0, 0, 0, 0); // Normalize time for accurate comparison

			console.log("date", value, selectedDate);

			if (isNaN(selectedDate.getTime())) {
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
		} else {
			// Handle other fields
			setFormData({ ...formData, [name]: value });
			if (errors[name as keyof typeof errors]) {
				setErrors({ ...errors, [name]: "" }); // Clear error for valid input
			}
		}
	};

	const handleAmountChange = (value: number | null) => {
		if (value === null || value <= 0) {
			setErrors({ ...errors, amount: "Amount must be greater than zero." });
			setFormData((prevState) => ({ ...prevState, amount: 0 })); // Reset to default value
		} else {
			setErrors({ ...errors, amount: "" });
			setFormData({ ...formData, amount: value });
		}
	};

	const handleSelectChange = (value: string) => {
		console.log("handleSelectChange", value);

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

		if (!formData.description)
			newErrors.description = "Description is required.";
		if (formData.amount === null || formData.amount <= 0)
			newErrors.amount = "Amount must be greater than zero.";
		if (!formData.date) newErrors.date = "Date is required.";
		if (!formData.currency) newErrors.currency = "Currency is required.";

		setErrors(newErrors);
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
		if (!validateForm()) return;

		setLoading(true);
		try {
			const { ...rest } = formData;
			const updatedFormData = {
				...formData,
				date: dateFormatter(formData.date),
			};
			console.log("formdata", rest);

			const response = await editTransaction(updatedFormData);

			const editedTransaction: TransactionFromDB = response.data.transaction;
			console.log("editedTransaction", editedTransaction);

			// const updatedDataSourceType: dataSourceType = {
			// 	key: editedTransaction.id,
			// 	...editedTransaction,
			// };
			// console.log("updatedDataSourceType",updatedDataSourceType)
			onTransactionUpdated(editedTransaction);

			setEditTransactionModal(false);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = async () => {
		setEditTransactionModal(false);
	};

	return (
		<Modal
			title="Edit Transaction"
			open={true}
			onCancel={handleClose}
			footer={null}
		>
			<Form layout="vertical" initialValues={formData}>
				<Form.Item label="Description">
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

				<Form.Item label="Amount">
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

				<Form.Item label="Date">
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

				<Form.Item label="Currency" name="Currency">
					<div>
						<Select
							placeholder="Select currency"
							value={formData.currency}
							onChange={handleSelectChange}
							onBlur={handleBlur}
							disabled={loading}
						>
							{currencyOptions.map((option) => (
								<Select.Option
									data-testid="currency-option"
									key={option.value}
									value={option.value}
								>
									{option.label}
								</Select.Option>
							))}
						</Select>
						{errors.currency && (
							<p className="text-red-500">{errors.currency}</p>
						)}
					</div>
				</Form.Item>

				{/* Footer Buttons */}
				<Form.Item>
					<div className="modal-footer">
						<Button
							aria-label="edit-close-button"
							onClick={handleClose}
							disabled={loading}
						>
							Close
						</Button>
						<Button
							aria-label="edit-save-button"
							type="primary"
							loading={loading}
							className="ml-2"
							onClick={handleSave}
							disabled={!isFormValid() || loading}
						>
							Save Changes
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default EditTransactionModal;
