// AddTransactionModal.tsx
import React, { useState } from "react";
import {
	Modal,
	Button,
	Input,
	Select,
	InputNumber,
	notification,
	Form,
} from "antd";
import { addTransaction } from "../services/operations/transactionsAPI";
import { TransactionFromDB, TransactionInput } from "../types/Transaction";
import { dateFormatter } from "../utils/dateFormatter";
const currencyOptions = [
	{ label: "USD", value: "USD" },
	{ label: "EUR", value: "EUR" },
	{ label: "INR", value: "INR" },
	{ label: "GBP", value: "GBP" },
];

// interface FormDataInterface {
// 	key: string;
// 	description: string;
// 	amount: number;
// 	date: string;
// 	currency: string;
// }

interface AddTransactionModalProps {
	setAddTransactionModal: (value: boolean) => void;
	onTransactionAdded: (transaction: TransactionFromDB) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
	setAddTransactionModal,
	onTransactionAdded,
}) => {
	const [formData, setFormData] = useState<TransactionInput>({
		description: "",
		amount: 0,
		date: "",
		currency: currencyOptions[0].value,
	});

	const [errorMessages, setErrorMessages] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleAmountChange = (value: number | null) => {
		setFormData({ ...formData, amount: value || 0 });
	};

	const handleSelectChange = (value: string, name: string) => {
		setFormData({ ...formData, [name]: value });
	};

	const validateForm = () => {
		const errors: string[] = [];
		if (!formData.description) errors.push("Description is required");
		if (formData.amount === null || formData.amount <= 0)
			errors.push("Amount must be greater than zero");
		if (!formData.date) errors.push("Date is required");
		if (!formData.currency) errors.push("Currency is required");

		setErrorMessages(errors);
		return errors.length === 0;
	};

	const handleSave = async () => {
		if (!validateForm()) return;

		setLoading(true);
		try {
			const updatedFormData = {
				...formData,
				date: dateFormatter(formData.date),
			};

			console.log("updatedFormData", updatedFormData);

			const response = await addTransaction(updatedFormData);

			const addedTransaction = response.data.transaction;
			console.log("addedTransaction", addedTransaction);

			onTransactionAdded(addedTransaction);
			setAddTransactionModal(false);
		} catch (error) {
			console.error("Error adding transaction:", error);
			notification.error({
				message: "Error",
				description: "An error occurred while processing the transaction.",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleClose = async () => {
		setAddTransactionModal(false);
	};

	return (
		<Modal
			title="Add Transaction"
			open={true}
			onCancel={() => setAddTransactionModal(false)}
			footer={false}
		>
			<Form layout="vertical" initialValues={formData} onFinish={handleSave}>
				<Form.Item
					label="Description"
					name="description"
					rules={[{ required: true, message: "Description is required" }]}
				>
					<Input
						placeholder="Enter description"
						name="description"
						value={formData.description}
						onChange={handleChange}
						disabled={loading}
					/>
				</Form.Item>

				<Form.Item
					label="Amount"
					name="amount"
					rules={[{ required: true, message: "Amount is required" }]}
				>
					<InputNumber
						placeholder="Enter amount"
						value={formData.amount}
						onChange={handleAmountChange}
						disabled={loading}
						className="w-full"
					/>
				</Form.Item>

				<Form.Item
					label="Date"
					name="date"
					rules={[{ required: true, message: "Date is required" }]}
				>
					<Input type="date" name="date" onChange={handleChange} />
				</Form.Item>

				<Form.Item
					label="Currency"
					name="currency"
					rules={[{ required: true, message: "Currency is required" }]}
				>
					<Select
						placeholder="Select currency"
						value={formData.currency}
						onChange={(value) => handleSelectChange(value, "currency")}
						disabled={loading}
					>
						{currencyOptions.map((option) => (
							<Select.Option key={option.value} value={option.value}>
								{option.label}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				{/* Error Messages */}
				{errorMessages.length > 0 && (
					<div className="error-messages">
						{errorMessages.map((error, index) => (
							<p key={index} className="text-red-500">
								{error}
							</p>
						))}
					</div>
				)}

				{/* Footer Buttons */}
				<Form.Item>
					<div className="modal-footer">
						<Button onClick={handleClose} disabled={loading}>
							Close
						</Button>
						<Button
							type="primary"
							htmlType="submit"
							loading={loading}
							className="ml-2"
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
