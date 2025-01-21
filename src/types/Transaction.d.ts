import { UUID } from "crypto";

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

export interface dataSourceType {
	key: UUID;
	id: UUID;
	date: string;
	description: string;
	amount: number;
	currency: string;
	amountInINR: number;
}
