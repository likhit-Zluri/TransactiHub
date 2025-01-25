import React, { useState } from "react";
import { Modal, Upload, Button, Checkbox, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadTransactions } from "../services/operations/transactionsAPI";

interface UploadCSVModalProps {
	setUploadCSVModal: (value: boolean) => void;
	onCSVUploaded: () => Promise<void>;
}

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({
	onCSVUploaded,
	setUploadCSVModal,
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [skipDuplicates, setSkipDuplicates] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	// const [showInstructions, setShowInstructions] = useState(false);

	const beforeUpload = (file: File) => {
		if (file.size > 1 * 1024 * 1024) {
			notification.error({
				message: "File size must be less than 1 MB.",
			});

			return Upload.LIST_IGNORE; // Prevents adding the file to the upload list
		}

		if (file.type !== "text/csv") {
			notification.error({
				message: "File size must be of text/csv type.",
			});

			return Upload.LIST_IGNORE; // Prevents adding the file to the upload list
		}
		setFile(file);
		return false; // Prevents auto upload
	};

	const handleUpload = async () => {
		if (!file) {
			notification.error({
				message: "Please select a CSV file to upload.",
			});
			return;
		}

		try {
			setIsUploading(true);
			// const response = await uploadTransactions(file, skipDuplicates);

			await uploadTransactions(file, skipDuplicates);
			await onCSVUploaded();
			setFile(null); // Reset file
			setSkipDuplicates(false); // Reset checkbox
			handleClose(); // Close the modal
		} catch (error) {
			console.error(error);
		} finally {
			setIsUploading(false);
		}
	};

	const handleClose = async () => {
		setUploadCSVModal(false);
	};

	return (
		<Modal
			title="Upload CSV File"
			open={true}
			onCancel={handleClose}
			footer={[
				<Button key="cancel" onClick={handleClose} disabled={isUploading}>
					Cancel
				</Button>,
				<Button
					key="upload"
					type="primary"
					onClick={handleUpload}
					disabled={!file || isUploading}
					loading={isUploading}
				>
					{isUploading ? "Uploading" : "Upload"}
				</Button>,
			]}
		>
			<div className="flex flex-col space-y-6 w-full">
				{/* File Upload Section */}
				<Upload.Dragger
					accept=".csv"
					beforeUpload={beforeUpload}
					showUploadList={file ? { showRemoveIcon: true } : false}
					onRemove={() => setFile(null)}
					maxCount={1}
				>
					<div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl border-gray-300 hover:border-blue-500 transition duration-300">
						<UploadOutlined className="text-3xl text-blue-500" />
						<p className="mt-2 text-lg font-semibold text-gray-700">
							Select or Drag & Drop CSV File
						</p>
						<p className="text-sm text-gray-500">
							Maximum File size: <strong>1MB</strong>
						</p>
					</div>
				</Upload.Dragger>

				{/* Options */}
				<Checkbox
					checked={skipDuplicates}
					onChange={(e) => setSkipDuplicates(e.target.checked)}
				>
					Skip duplicate rows
				</Checkbox>

				{/* Instructions */}
				<div className="bg-gray-50 p-2 rounded-lg shadow-md">
					<h3 className="text-md font-semibold text-gray-800">
						<strong>File Upload Instructions</strong>
					</h3>
					<p className="text-sm text-gray-600">
						Only one <strong>CSV</strong> file can be uploaded at a time. Ensure
						the file includes the following columns:
					</p>
					<ul className="list-disc pl-6 text-sm text-gray-600">
						<li>
							<strong>Date</strong>: Format: <strong>DD-MM-YYYY</strong> and
							cannot be a future date.
						</li>
						<li>
							<strong>Description</strong>: Brief description (max 255
							characters).
						</li>
						<li>
							<strong>Amount</strong>: Must be a positive number and up to 2
							decimal places.
						</li>
						<li>
							<strong>Currency</strong>: A 3-character ISO code (e.g., USD,
							EUR).
						</li>
					</ul>
					<div className="h-4"></div>
					<p className="text-sm text-gray-600">
						<strong>Note: </strong>If any errors are found during processing, a
						CSV file containing the errors will be downloaded for your review.
					</p>
				</div>
			</div>
		</Modal>
	);
};

export default UploadCSVModal;
