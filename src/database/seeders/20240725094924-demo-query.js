"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
	up: async (queryInterface) => {
		// Seed data for querry table
		await queryInterface.bulkInsert(
			"querries",
			[
				{
					id: uuidv4(),
					firstName: "Liam",
					lastName: "O'Connor",
					subject: "Feedback",
					email: "liam.oconnor@example.com",
					message: "Great app, but it could use some improvements.",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: uuidv4(),
					firstName: "Emma",
					lastName: "Smith",
					subject: "Inquiry",
					email: "emma.smith@example.com",
					message: "I have a question about the new feature.",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: uuidv4(),
					firstName: "Noah",
					lastName: "Johnson",
					subject: "Issue Report",
					email: "noah.johnson@example.com",
					message: "I encountered a bug while using the app.",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete("querries", null, {});
	},
};
