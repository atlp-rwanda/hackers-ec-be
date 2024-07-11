import { responses } from "../responses";

const createProduct = {
	tags: ["Products"],
	security: [
		{
			bearerAuth: [],
		},
	],
	summary: "Creating product",
	requestBody: {
		required: true,
		content: {
			"multipart/form-data": {
				schema: {
					type: "object",
					properties: {
						name: {
							type: "string",
							description: "Product name",
							required: true,
							example: "BMW",
						},
						price: {
							type: "number",
							description: "Price of product",
							required: true,
							minimum: 1,
							example: 499000,
						},
						images: {
							type: "array",
							items: {
								type: "string",
								format: "binary",
							},
							description: "Product images",
							minItems: 3,
							maxItems: 8,
						},
						discount: {
							type: "number",
							description: "Discount for a product",
							example: 0,
						},
						quantity: {
							type: "number",
							description: "quantity of product",
							required: true,
							minimum: 1,
							example: 123,
						},
						categoryId: {
							type: "string",
							description: "Product category",
							required: true,
							format: "uuid",
						},
						expiryDate: {
							type: "string",
							format: "date",
							description: "Expired date of product",
							example: "2121-01-01",
						},
					},
				},
			},
		},
	},
	consumes: ["application/json"],
	responses,
};

const read_products = {
	all: {
		tags: ["Products"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "List of all the products",
		description: "Get all of the products",
		responses,
	},
	single: {
		tags: ["Products"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Get a single product",
		description: "Get a single product",
		parameters: [
			{
				in: "path",
				name: "id",
				required: true,
				schema: {
					type: "string",
					format: "uuid",
				},
			},
		],
		responses,
	},
};

const product_recommendations = {
	tags: ["Products"],
	security: [
		{
			bearerAuth: [],
		},
	],
	summary: "Get product recommendations",
	description: "Get product recommendations",
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "product Id",
							required: true,
							example: "12nvctyknbvnhg6teffhgfrtyuikmnb",
						},
					},
				},
			},
		},
	},
	responses,
};

const update_product = {
	tags: ["Products"],
	security: [
		{
			bearerAuth: [],
		},
	],
	summary: "Updating a product",
	parameters: [
		{
			in: "path",
			name: "id",
			required: true,
			schema: {
				type: "string",
				format: "uuid",
			},
		},
	],
	requestBody: {
		required: true,
		content: {
			"multipart/form-data": {
				schema: {
					type: "object",
					properties: {
						name: {
							type: "string",
							description: "Product name",
							required: true,
							example: "BMW7",
						},
						price: {
							type: "number",
							description: "Price of product",
							required: true,
							minimum: 1,
							example: 499000,
						},
						images: {
							type: "array",
							items: {
								minItems: 4,
								type: "file",
							},
						},
						quantity: {
							type: "number",
							description: "quantity of product",
							required: true,
							minimum: 1,
							example: 123,
						},
						discount: {
							type: "number",
							description: "Discount for a product",
							example: 100,
						},
						categoryId: {
							type: "string",
							description: "Product category",
							required: true,
							format: "uuid",
						},
						expiryDate: {
							type: "string",
							format: "date",
							description: "Expired date of product",
							example: "2121-01-01",
						},
					},
				},
			},
		},
	},
	responses,
};
const update_product_status = {
	tags: ["Products"],
	security: [
		{
			bearerAuth: [],
		},
	],
	summary: "Updating a product availability status",
	parameters: [
		{
			in: "path",
			name: "id",
			required: true,
			schema: {
				type: "string",
				format: "uuid",
			},
		},
	],
	responses,
};

const delete_product = {
	tags: ["Products"],
	security: [
		{
			bearerAuth: [],
		},
	],
	summary: "Deleting a product",
	parameters: [
		{
			in: "path",
			name: "ID",
			required: true,
			schema: {
				type: "string",
				format: "uuid",
			},
		},
	],
	responses,
};

const guest_read_all_products = {
	tags: ["Products"],
	summary: "List of all the products",
	description: "Get all of the products",
	responses,
};

const guest_read_single_product = {
	tags: ["Products"],
	summary: "Get a single product",
	description: "Get a single product",
	parameters: [
		{
			in: "path",
			name: "id",
			required: true,
			schema: {
				type: "string",
				format: "uuid",
			},
		},
	],
	responses,
};
export const products = {
	"/api/v1/products": {
		post: createProduct,
	},
	"/api/v1/products/": {
		get: read_products["all"],
	},
	"/api/v1/products/{id}": {
		get: read_products["single"],
	},
	"/api/v1/products/recommended": {
		post: product_recommendations,
	},
	"/api/v1/products/{id}/": {
		patch: update_product,
	},
	"/api/v1/products/{id}/availability-status": {
		patch: update_product_status,
	},
	"/api/v1/products/{ID}": {
		delete: delete_product,
	},
	"/api/v1/products/guest-products": {
		get: guest_read_all_products,
	},
	"/api/v1/products/guest-products/{id}": {
		get: guest_read_single_product,
	},
};
