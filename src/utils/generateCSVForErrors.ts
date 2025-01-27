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
			let csvContent = "";
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
	let combinedCsvContent =
		"Index,Error Type,Error\n" + validationCsvContent + duplicationCsvContent;

	// Add Existing Transaction Errors as well (if needed)
	const existingTransactionCsvContent = generateCsvContent(
		existingTransaction,
		"Existing Transaction"
	);
	if (existingTransactionCsvContent) {
		combinedCsvContent += "\n" + existingTransactionCsvContent;
	}
	// console.log("combinedCsvContent", combinedCsvContent);
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
