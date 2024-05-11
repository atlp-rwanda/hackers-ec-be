import { Optional } from "sequelize";
import { cartItem } from "./cart";

/**
 * -------------- User Model ---------------------
 */

export interface UserModelAttributes {
	id: string;
	userName: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	role: string;
	isVerified: boolean;
<<<<<<< HEAD
	isPasswordExpired?: boolean;
	lastTimePasswordUpdated?: Date;
	isActive?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	gender?: string;
	birthDate?: Date;
	phoneNumber?: string;
	preferredLanguage?: string;
	preferredCurrency?: string;
	profileImage?: string;
	addressLine1?: string;
	addressLine2?: string;
	country?: string;
	city?: string;
	zipCode?: number;
=======
	isActive: boolean;
>>>>>>> fa58d14 (ft(user-status): added controller and middleware functionalities)
}

export interface UserModelInclude extends UserModelAttributes {
	Roles: any;
}

export type UserCreationAttributes = Optional<
	UserModelAttributes,
	"id" | "createdAt" | "updatedAt"
> & {
	role?: string;
	firstName?: string;
	lastName?: string;
	gender?: string;
	birthDate?: Date;
	phoneNumber?: string;
	preferredLanguage?: string;
	preferredCurrency?: string;
	profileImage?: string;
	addressLine1?: string;
	addressLine2?: string;
	country?: string;
	city?: string;
	zipCode?: number;
};

/**
 * -------------- Token Model ---------------------
 */

export interface TokenModelAttributes {
	id: string;
	token: string;
}

export type TokenCreationAttributes = Optional<TokenModelAttributes, "id">;

/**
 * -------------- Product Model ---------------------
 */

export interface ProductAttributes {
	id: string;
	name: string;
	price: number;
	images: string[];
	discount: number;
	quantity: number;
	sellerId: string;
	categoryId: string;
	expiryDate: Date;
	productStatus?: string;
}

export type ProductCreationAttributes = Omit<ProductAttributes, "id">;

/**
 * -------------- Category Model ---------------------
 */

export interface CategoryAttributes {
	id: string;
	name: string;
	description: string;
}

export type CategoryCreationAttributes = Omit<CategoryAttributes, "id">;

/**
 * ----------------- Blacklist model ----------------------------
 */
export interface BlacklistModelAtributes {
	id?: string;
	token: string;
}

/**
 * ----------------- reset model ----------------------------
 */

export interface resetPasswordModelAtributes {
	id?: string;
	email: string;
	resetToken: string;
}
/**
 * ----------------- role model ----------------------------
 */

export interface roleModelAttributes {
	id: string;
	roleName: string;
}
export type roleCreationAttributes = Optional<roleModelAttributes, "id">;

/**
 * ----------------- role model ----------------------------
 */

export interface messageModelAttributes {
	id: string;
	senderId: string;
	message: string;
}
/**
 * -------------- Wishes Model ---------------------
 */
export interface WishesAttributes {
	id: string;
	userId: string;
	productId: string;
	product?: ProductAttributes;
}
export interface WishesCreationAttributes
	extends Omit<WishesAttributes, "id"> {}
// ---------------------------- cart --------------------------------

export interface cartModelAttributes {
	id: string;
	userId: string;
	products: Array<cartItem>;
	total: number;
}
export type cartCreationAttributes = Optional<cartModelAttributes, "id">;
