export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export interface TransactionInput {
	date: string;
	description: string;
	amount: number;
	currency: string;
}
export interface TransactionFromDB {
	id: UUID;
	date: string;
	parsedDate: Date;
	description: string;
	amount: number;
	amountInINR: number;
	currency: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}
export interface TransactionOutput {
	date: string;
	description: string;
	amount: number;
	currency: string;
	amountInINR: number;
}

export interface AntUiTransaction extends TransactionOutput {
	id: UUID;
	key: UUID;
}
