"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn("querries", "message", {
			type: Sequelize.TEXT,
			allowNull: false,
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn("querries", "message", {
			type: Sequelize.STRING(255),
			allowNull: false,
		});
	},
};
