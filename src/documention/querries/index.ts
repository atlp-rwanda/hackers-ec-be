import { responses } from "../responses";

const readQuerries = {
	all: {
		tags: ["Querries"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "List of all the querries",
		description: "Get all of the querries",
		responses,
	},
	single: {
		tags: ["Querries"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Get a single querry",
		description: "Get a single querry",
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

const create_querry = {
	tags: ["Querries"],
	summary: "Creating new querry",
	requestBody: {
		required: true,
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						firstName: {
							type: "string",
							description: "  User fisrt name",
							required: true,
							example: "John",
						},
						lastName: {
							type: "string",
							description: "User last name",
							required: true,
							example: "Doe",
						},
						subject: {
							type: "string",
							description: "subject",
							required: true,
							example: "Appreciation",
						},
						email: {
							type: "string",
							description: "User email",
							required: true,
							example: "example@gmail.com",
						},
						message: {
							type: "string",
							description: "Message",
							required: true,
							example: "Your app works really well",
						},
					},
				},
			},
		},
	},
	responses,
};

export const querriesEndpoints = {
	"/api/v1/querries": {
		get: readQuerries["all"],
	},
	"/api/v1/querries/{id}": {
		get: readQuerries["single"],
	},

	"/api/v1/querries/": {
		post: create_querry,
	},
};
