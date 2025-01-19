import { UUID } from "crypto";

export interface TransactionInput {
	date: string;
	description: string;
	amount: number;
	currency: string;
}
export interface TransactionInDB {
	id: UUID;
	date: string;
	description: string;
	amount: number;
	currency: string;
	amountInINR: number;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}
