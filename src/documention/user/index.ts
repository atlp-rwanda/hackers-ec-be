import { string } from "joi";
import { responses } from "../responses";

const users = {
	"/users/register": {
		post: {
			tags: ["User"],
			security: [{ JWT: [] }],
			summary: "Register user",
			parameters: [
				{
					in: "body",
					name: "request body",
					required: true,
					schema: {
						type: "object",
						properties: {
							email: {
								type: string,
								example: "email@example.com",
							},
							userName: {
								type: "string",
								example: "kalake250",
							},
							firstName: {
								type: "string",
								example: "kalake",
							},
							lastName: {
								type: "string",
								example: "kalisa",
							},
							password: {
								type: "string",
								example: "passwordQWE123",
							},
							confirmPassword: {
								type: "string",
								example: "passwordQWE123",
							},
						},
					},
				},
			],
			consumes: ["application/json"],
			responses,
		},
	},
	"/users/login": {
		post: {
			tags: ["User"],
			security: [{ JWT: [] }],
			summary: "Login user",
			parameters: [
				{
					in: "body",
					name: "request body",
					required: true,
					schema: {
						type: "object",
						properties: {
							email: {
								type: "string",
								example: "email@example.com",
							},
							password: {
								type: "string",
								example: "passwordQWE123",
							},
						},
					},
				},
			],
			consumes: ["application/json"],
			responses,
		},
	},
	"/users/account/verify/{token}": {
		get: {
			tags: ["User"],
			summary: "Verify user account",
			parameters: [
				{
					in: "path",
					name: "token",
					required: true,
					type: "string",
					description: "Verification token",
				},
			],
			responses: {
				"200": {
					description: "Email verified successfully",
					schema: {
						type: "object",
						properties: {
							status: {
								type: "integer",
								example: 200,
							},
							message: {
								type: "string",
								example: "Email verified successfull",
							},
						},
					},
				},
				"400": {
					description: "Invalid link or something went wrong",
					schema: {
						type: "object",
						properties: {
							status: {
								type: "integer",
								example: 400,
							},
							message: {
								type: "string",
								example: "Invalid link",
							},
							error: {
								type: "string",
							},
						},
					},
				},
			},
		},
	},
};

export default users;
