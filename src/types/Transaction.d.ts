import { UUID } from "crypto";

export interface Transaction {
	id: UUID;
	date: string;
	description: string;
	amount: string;
	currency: string;
	amountInINR: string;
}
export interface TransactionInput {
	date: string;
	description: string;
	amount: number;
	currency: string;
}
