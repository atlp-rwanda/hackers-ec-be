"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"categories",
			[
				{
					id: "8dfe453c-b779-453c-b96e-afe656eeebab",
					name: "Fruits",
					description: "Fruits are amazing",
					updatedAt: new Date(),
					createdAt: new Date(),
				},
			],
			{},
		);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("categories", null, {});
	},
};
