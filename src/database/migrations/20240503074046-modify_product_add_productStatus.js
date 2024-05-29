"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn(
				"products", // table name
				"productStatus", // new field name
				{
					type: Sequelize.STRING,
					allowNull: false,
					defaultValue: "Unavailable",
				},
			),
		]);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn("products", "productStatus"),
		]);
	},
};
