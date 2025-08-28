export enum Language {
	EN = 'en',
	RU = 'ru',
	UZ = 'uz',
	TR = 'tr',
}

export type RoleUser = 'ADMIN' | 'INSTRUCTOR' | 'USER'|'STUDENT';

export interface CardType {
	id: string;
	billing_details: {
		address: {
			city: string;
			country: string;
			line1: string;
			line2: string;
			postal_code: string;
			state: string;
		};
		name: string;
	};
	card: {
		brand: string;
		exp_month: number;
		exp_year: number;
		last4: string;
	};
}

export interface ProductsType {
	default_price: {
		id: string;
		nickname: string;
		unit_amount: number;
	};
	description: string;
	id: string;
	name: string;
}
