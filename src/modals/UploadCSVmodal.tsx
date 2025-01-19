// import React, { useState } from "react";
// import { Button } from "primereact/button";

// // import { uploadCSV } from "../services/operations/csvAPI";

// const UploadCSVModal = ({
// 	setUploadCSVModal,
// }: {
// 	setUploadCSVModal: (value: boolean) => void;
// }) => {
// 	const [file, setFile] = useState<File | null>(null);
// 	const [loading, setLoading] = useState(false);
// 	const [errorMessages, setErrorMessages] = useState<string[]>([]);

// 	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const selectedFile = e.target.files ? e.target.files[0] : null;

// 		if (selectedFile) {
// 			if (selectedFile.size > 1024 * 1024) {
// 				setErrorMessages(["File size should be under 1MB"]);
// 				setFile(null);
// 			} else if (selectedFile.type !== "text/csv") {
// 				setErrorMessages(["Only CSV files are allowed"]);
// 				setFile(null);
// 			} else {
// 				setErrorMessages([]);
// 				setFile(selectedFile);
// 			}
// 		}
// 	};

// 	const handleUpload = async () => {
// 		if (!file) {
// 			setErrorMessages(["Please select a valid CSV file"]);
// 			return;
// 		}
// 		console.log("handleUpload called");
// 		setLoading(true); // Start loading

// 		// try {
// 		// 	await uploadCSV(file); // Call API to upload the file
// 		// 	setUploadCSVModal(false); // Close modal on successful upload
// 		// } catch (error) {
// 		// 	console.error("Error uploading CSV:", error);
// 		// 	setErrorMessages(["There was an error processing the file"]);
// 		// } finally {
// 		// 	setLoading(false); // Stop loading
// 		// }
// 	};

// 	return (
// 		<div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
// 			<div className="bg-white p-8 rounded-md shadow-lg max-w-lg w-full space-y-6">
// 				<div className="flex items-center justify-between">
// 					<h2 className="text-2xl font-semibold text-gray-800">Upload CSV</h2>
// 					<div className="flex space-x-4">
// 						<Button
// 							label="Close"
// 							icon="pi pi-times p-ml-2"
// 							onClick={() => setUploadCSVModal(false)}
// 							className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition"
// 							iconPos="left"
// 							disabled={loading} // Disable button when loading
// 						/>
// 						<Button
// 							label="Upload"
// 							icon="pi pi-upload"
// 							onClick={handleUpload}
// 							className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition"
// 							iconPos="left"
// 							disabled={loading} // Disable button when loading
// 						/>
// 					</div>
// 				</div>

// 				{/* File Input */}
// 				<div className="mt-4">
// 					<input
// 						type="file"
// 						accept=".csv"
// 						onChange={handleFileChange}
// 						className="w-full px-4 py-2 border border-gray-300 rounded-md"
// 						disabled={loading} // Disable file input when loading
// 					/>
// 				</div>

// 				{/* Loading State */}
// 				{loading && (
// 					<div className="text-center text-green-600 font-semibold">
// 						Processing CSV...
// 					</div>
// 				)}

// 				{/* Error Messages */}
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

// export default UploadCSVModal;

import React, { useState } from "react";
import { Modal, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

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
			console.log("Uploading file...");
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
			visible={true}
			onCancel={() => setUploadCSVModal(false)}
			footer={null}
			width={600}
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
