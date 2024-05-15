import { Request } from "express";
import { cartModelAttributes } from "./model";

export type PaymentDetails = {
	payerId: string;
	paymentMethod: string;
	paymentId: string;
};

export interface CartRequest extends Request {
	cart: cartModelAttributes;
}

export interface MomoInfo extends Request {
	momoInfo?: {
		XReferenceId: string;
	};
}
