// EditTransactionModal.tsx
import React, { useState } from "react";
import { Modal, Button, Input, Select, InputNumber, Form } from "antd";
import { editTransaction } from "../services/operations/transactionsAPI";
import { TransactionFromDB } from "../types/Transaction";
import { UUID } from "crypto";
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
	const [formData, setFormData] = useState<FormDataInterface>({
		...transactionToEdit,
		amount: transactionToEdit.amount / 100,
		date: dateFormatter(transactionToEdit.date),
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
		} catch (error) {
			console.error("Error editing transaction:", error);
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
							Save Changes
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default EditTransactionModal;
