import { responses } from "../responses";

const payment = {
	tags: ["Payments"],
	security: [
		{
			bearerAuth: [],
		},
	],
	summary: "Payment using stripe or momoPay",
	parameters: [
		{
			in: "query",
			name: "method",
			required: true,
			schema: {
				type: "string",
			},
		},
	],
	responses,
};

export const app_payments = {
	"/api/v1/payments?method={method}": {
		post: payment,
	},
};
