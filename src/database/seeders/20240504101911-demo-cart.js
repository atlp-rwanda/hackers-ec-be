"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		const productsData = [
			{
				id: "9e555bd6-0f36-454a-a3d5-89edef4ff9d4",
				name: "Apple",
				price: 29,
				images: JSON.stringify([
					"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877715/e-commerce/cx03adwvxevuvxxeewyv.png",
					"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877717/e-commerce/r7h5yvc5nbdtjt5yqoua.jpg",
					"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877719/e-commerce/pegxb75y2c7x6rwtmrho.png",
					"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877721/e-commerce/biqpzdojtmbv0z55bhew.png",
				]),
				discount: 0,
				quantity: 390,
				sellerId: "7321d946-7265-45a1-9ce3-3da1789e657e",
				categoryId: "8dfe453c-b779-453c-b96e-afe656eeebab",
				expiryDate: "2324-04-30T00:00:00.000Z",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];

		await queryInterface.bulkInsert("carts", [
			{
				id: "10555bd6-0f36-454a-a3d5-89edef4ff9d1",
				userId: "7121d946-7265-45a1-9ce3-3da1789e657e",
				products: JSON.stringify(productsData),
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("carts", null, {});
	},
};
