import { responses } from "../responses";

const register_login = {
	register: {
		tags: ["User"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Register user",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							email: {
								type: "string",
								description: "Email address",
								required: true,
								example: "email@example.com",
							},
							userName: {
								type: "string",
								description: "User name",
								required: true,
								example: "kalake250",
							},
							firstName: {
								type: "string",
								description: "Your first name",
								required: true,
								example: "kalake",
							},
							lastName: {
								type: "string",
								description: "Your last name",
								required: true,
								example: "kalisa",
							},
							password: {
								type: "string",
								description: "Password",
								required: true,
								example: "passwordQWE123",
							},
							confirmPassword: {
								type: "string",
								description: "Confirm Password",
								required: true,
								example: "passwordQWE123",
							},
						},
					},
				},
			},
		},
		responses,
	},

	login: {
		tags: ["User"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Login user",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							email: {
								type: "string",
								description: "Email address",
								required: true,
								example: "email@example.com",
							},
							password: {
								type: "string",
								description: "User password",
								required: true,
								example: "passwordQWE123",
							},
						},
					},
				},
			},
		},
		consumes: ["application/json"],
		responses,
	},

	logout: {
		tags: ["User"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Log out a user",
		consumes: ["application/json"],
		responses,
	},
};

const userAccount = {
	verify: {
		tags: ["User"],
		security: [
			{
				bearerAuth: [],
			},
		],
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
		responses,
	},
};

const updatePassword = {
	update_password: {
		tags: ["User"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Update user's password",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							oldPassword: {
								type: "string",
								description: "User old password",
								required: true,
								example: "passwordQWE123",
							},
							newPassword: {
								type: "string",
								description: "User new password",
								required: true,
								example: "passworddQWE123",
							},
							confirmPassword: {
								type: "string",
								description: "User confirm new password",
								required: true,
								example: "passworddQWE123",
							},
						},
					},
				},
			},
		},
		consumes: ["application/json"],
		responses,
	},
};

const reset2_FA = {
	request_reset: {
		tags: ["User"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Two-factor authentication",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							email: {
								type: "string",
								description: "Email address",
								required: true,
								example: "email@example.com",
							},
						},
					},
				},
			},
		},
		responses,
	},

	request_password: {
		tags: ["User"],
		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Reset password",

		parameters: [
			{
				in: "path",
				name: "token",
				required: true,
				schema: {
					type: "string",
				},
				description: "The reset password token",
			},
		],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							password: {
								type: "string",
								description: "New password",
								required: true,
								example: "password@123!",
							},
						},
					},
				},
			},
		},
		responses,
	},
	Twofa: {
		tags: ["User"],

		security: [
			{
				bearerAuth: [],
			},
		],
		summary: "Request password reset",
		parameters: [
			{
				in: "path",
				name: "token",
				required: true,
				schema: {
					type: "string",
					example: "your_access_token",
				},
			},
		],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							otp: {
								type: "string",
								description: "OTP",
								required: true,
								example: "123456",
							},
						},
					},
				},
			},
		},
		responses,
	},
};

export const users = {
	"/api/v1/users/register": {
		post: register_login["register"],
	},
	"/api/v1/users/login": {
		post: register_login["login"],
	},
	"/api/v1/users/logout": {
		post: register_login["logout"],
	},

	"/api/v1/users/account/verify/{token}": {
		get: userAccount["verify"],
	},

	"/api/v1/users/password-update": {
		patch: updatePassword["update_password"],
	},

	"/api/v1/users/forgot-password": {
		post: reset2_FA["request_reset"],
	},
	"/api/v1/users/reset-password/{token}": {
		post: reset2_FA["request_password"],
	},

	"/api/v1/users/2fa/{token}": {
		post: reset2_FA["Twofa"],
	},
};
