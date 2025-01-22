// import { saveAs } from "file-saver";

// export const generateCsvForErrors = async (
// 	validationErrors: { index: number; msg: string }[],
// 	duplicationErrors: { index: number; msg: string }[],
// 	existingTransaction: { index: number; msg: string }[]
// ) => {
// 	// Utility function to generate CSV content
// 	const generateCsvContent = (
// 		errors: { index: number; msg: string }[],
// 		errorType: string
// 	) => {
// 		if (errors && errors.length > 0) {
// 			let csvContent = "Index,Error Type,Error\n";
// 			csvContent += errors
// 				.map(({ index, msg }) => `${index},"${errorType}","${msg}"`)
// 				.join("\n");
// 			return csvContent;
// 		}
// 		return "";
// 	};

// 	// Utility function to create a CSV blob
// 	const createCsvBlob = (csvContent: string) => {
// 		return new Blob([decodeURIComponent(encodeURI(csvContent))], {
// 			type: "text/csv;charset=utf-8;",
// 		});
// 	};

// 	// Generate CSV content for each error type
// 	const validationCsvContent = generateCsvContent(
// 		validationErrors,
// 		"Validation"
// 	);
// 	const duplicationCsvContent = generateCsvContent(
// 		duplicationErrors,
// 		"Duplication"
// 	);
// 	const existingTransactionCsvContent = generateCsvContent(
// 		existingTransaction,
// 		"Existing Transaction"
// 	);

// 	// Create the corresponding blobs for each CSV content
// 	const csvPromises = [];

// 	if (validationCsvContent) {
// 		const validationBlob = createCsvBlob(validationCsvContent);
// 		csvPromises.push(saveAs(validationBlob, "validation_errors.csv"));
// 	}

// 	if (duplicationCsvContent) {
// 		const duplicationBlob = createCsvBlob(duplicationCsvContent);
// 		csvPromises.push(saveAs(duplicationBlob, "duplication_errors.csv"));
// 	}

// 	if (existingTransactionCsvContent) {
// 		const existingTransactionBlob = createCsvBlob(
// 			existingTransactionCsvContent
// 		);
// 		csvPromises.push(
// 			saveAs(existingTransactionBlob, "existing_transaction_errors.csv")
// 		);
// 	}

// 	// Wait for all CSVs to be processed in parallel
// 	await Promise.all(csvPromises);
// };


import { saveAs } from "file-saver";

export const generateCsvForErrors = async (
	validationErrors: { index: number; msg: string }[],
	duplicationErrors: { index: number; msg: string }[],
	existingTransaction: { index: number; msg: string }[]
) => {
	// Utility function to generate CSV content
	const generateCsvContent = (
		errors: { index: number; msg: string }[],
		errorType: string
	) => {
		if (errors && errors.length > 0) {
			let csvContent = "Index,Error Type,Error\n";
			csvContent += errors
				.map(({ index, msg }) => `${index},"${errorType}","${msg}"`)
				.join("\n");
			return csvContent;
		}
		return "";
	};

	// Generate CSV content for Validation and Duplication errors in a single file
	const validationCsvContent = generateCsvContent(
		validationErrors,
		"Validation"
	);
	const duplicationCsvContent = generateCsvContent(
		duplicationErrors,
		"Duplication"
	);

	// Combine both contents into one CSV
	let combinedCsvContent = validationCsvContent + "\n" + duplicationCsvContent;

	// Add Existing Transaction Errors as well (if needed)
	const existingTransactionCsvContent = generateCsvContent(
		existingTransaction,
		"Existing Transaction"
	);
	if (existingTransactionCsvContent) {
		combinedCsvContent += "\n" + existingTransactionCsvContent;
	}

	// Create the combined CSV blob
	const combinedCsvBlob = new Blob(
		[decodeURIComponent(encodeURI(combinedCsvContent))],
		{
			type: "text/csv;charset=utf-8;",
		}
	);

	// Save the combined CSV file
	saveAs(combinedCsvBlob, "validation_and_duplication_errors.csv");
};
