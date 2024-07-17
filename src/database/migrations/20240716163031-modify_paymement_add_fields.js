module.exports = {
	up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn("payments", "sessionId", {
				type: Sequelize.STRING,
				defaultValue: false,
				allowNull: true,
			}),
			queryInterface.addColumn("payments", "orderId", {
				type: Sequelize.STRING,
				defaultValue: false,
				allowNull: true,
			}),
		]);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn("payments", "sessionId"),
			queryInterface.removeColumn("payments", "orderId"),
		]);
	},
};
