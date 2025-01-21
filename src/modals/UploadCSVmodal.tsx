import { useState } from "react";
import { Modal, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadTransactions } from "../services/operations/transactionsAPI";

const UploadCSVModal = ({
	setUploadCSVModal,
}: {
	setUploadCSVModal: (value: boolean) => void;
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [errorMessages, setErrorMessages] = useState<string[]>([]);

	const handleFileChange = (info: any) => {
		if (info.fileList.length > 0) {
			const selectedFile = info.fileList[0].originFileObj;
			if (selectedFile) {
				if (selectedFile.size > 1024 * 1024) {
					setErrorMessages(["File size should be under 1MB"]);
					setFile(null);
				} else if (selectedFile.type !== "text/csv") {
					setErrorMessages(["Only CSV files are allowed"]);
					setFile(null);
				} else {
					setErrorMessages([]);
					setFile(selectedFile);
				}
			}
		}
	};

	const handleUpload = async () => {
		if (!file) {
			setErrorMessages(["Please select a valid CSV file"]);
			return;
		}
		console.log("handleUpload called");
		setLoading(true); // Start loading

		try {
			// Example upload logic (mocked)
			console.log("Uploading file...",file);

			await uploadTransactions(file, true);
			message.success("File uploaded successfully!");
			setUploadCSVModal(false); // Close modal on successful upload
		} catch (error) {
			console.error("Error uploading CSV:", error);
			setErrorMessages(["There was an error processing the file"]);
		} finally {
			setLoading(false); // Stop loading
		}
	};

	return (
		<Modal
			title="Upload CSV"
			open={true}
			onCancel={() => setUploadCSVModal(false)}
			footer={false}
		>
			<div className="space-y-4">
				<Upload
					beforeUpload={() => false} // Prevent automatic upload
					onChange={handleFileChange}
					accept=".csv"
					fileList={file ? [file] : []}
				>
					<Button icon={<UploadOutlined />} disabled={loading}>
						Select CSV File
					</Button>
				</Upload>

				{/* Loading State */}
				{loading && (
					<div className="text-center text-green-600 font-semibold">
						Processing CSV...
					</div>
				)}

				{/* Error Messages */}
				{errorMessages.length > 0 && (
					<div className="p-error mt-4 text-red-500">
						<ul className="list-disc pl-5">
							{errorMessages.map((msg, idx) => (
								<li key={idx}>{msg}</li>
							))}
						</ul>
					</div>
				)}

				<div className="flex justify-between mt-6">
					<Button
						onClick={() => setUploadCSVModal(false)}
						disabled={loading}
						className="bg-gray-500 hover:bg-gray-600 text-white font-medium"
					>
						Close
					</Button>
					<Button
						type="primary"
						onClick={handleUpload}
						disabled={loading || !file}
						className="bg-blue-500 hover:bg-blue-600 text-white font-medium"
					>
						Upload
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default UploadCSVModal;
