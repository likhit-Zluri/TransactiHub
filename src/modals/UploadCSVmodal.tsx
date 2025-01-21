import React, { useState } from "react";
import { Modal, Upload, Button, Checkbox, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadTransactions } from "../services/operations/transactionsAPI";

interface UploadCSVModalProps {
	setUploadCSVModal: (value: boolean) => void;
}

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({
	setUploadCSVModal,
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [skipDuplicates, setSkipDuplicates] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const beforeUpload = (file: File) => {
		if (file.size > 1 * 1024 * 1024) {
			notification.error({
				message: "File size must be less than 1 MB.",
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
			<Upload
				accept=".csv"
				beforeUpload={beforeUpload}
				showUploadList={file ? { showRemoveIcon: true } : false}
				onRemove={() => setFile(null)}
				maxCount={1}
			>
				<Button icon={<UploadOutlined />}>Select CSV File</Button>
			</Upload>
			<Checkbox
				checked={skipDuplicates}
				onChange={(e) => setSkipDuplicates(e.target.checked)}
				style={{ marginTop: 16 }}
			>
				Skip duplicate rows
			</Checkbox>
		</Modal>
	);
};

export default UploadCSVModal;
