"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			"products",
			[
				{
					id: "9e555bd6-0f36-454a-a3d5-89edef4ff9d4",
					name: "Apple",
					price: 29,
					images: [
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877715/e-commerce/cx03adwvxevuvxxeewyv.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877717/e-commerce/r7h5yvc5nbdtjt5yqoua.jpg",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877719/e-commerce/pegxb75y2c7x6rwtmrho.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877721/e-commerce/biqpzdojtmbv0z55bhew.png",
					],
					discount: 0,
					quantity: 390,
					sellerId: "7321d946-7265-45a1-9ce3-3da1789e657e",
					categoryId: "8dfe453c-b779-453c-b96e-afe656eeebab",
					expiryDate: "2324-04-30T00:00:00.000Z",
					createdAt: new Date(),
					updatedAt: new Date(),
				},

				{
					id: "9e555bd6-0f36-454a-a3d5-89edef4ff9d1",
					name: "Mongo",
					price: 31,
					images: [
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877715/e-commerce/cx03adwvxevuvxxeewyv.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877717/e-commerce/r7h5yvc5nbdtjt5yqoua.jpg",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877719/e-commerce/pegxb75y2c7x6rwtmrho.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877721/e-commerce/biqpzdojtmbv0z55bhew.png",
					],
					discount: 0,
					quantity: 290,
					sellerId: "7321d946-7265-45a1-9ce3-3da1789e657e",
					categoryId: "8dfe453c-b779-453c-b96e-afe656eeebab",
					expiryDate: "2324-04-20T00:00:00.000Z",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "9e555bd6-0f36-454a-a3d5-89edef4ff9d2",
					name: "Avocado",
					price: 14,
					images: [
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877715/e-commerce/cx03adwvxevuvxxeewyv.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877717/e-commerce/r7h5yvc5nbdtjt5yqoua.jpg",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877719/e-commerce/pegxb75y2c7x6rwtmrho.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877721/e-commerce/biqpzdojtmbv0z55bhew.png",
					],
					discount: 4,
					quantity: 190,
					sellerId: "7321d946-7265-45a1-9ce3-3da1789e657e",
					categoryId: "8dfe453c-b779-453c-b96e-afe656eeebab",
					expiryDate: "2324-04-30T00:00:00.000Z",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "9e555bd6-0f36-454a-a3d5-89edef4ff9d3",
					name: "Banana",
					price: 83,
					images: [
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877715/e-commerce/cx03adwvxevuvxxeewyv.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877717/e-commerce/r7h5yvc5nbdtjt5yqoua.jpg",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877719/e-commerce/pegxb75y2c7x6rwtmrho.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877721/e-commerce/biqpzdojtmbv0z55bhew.png",
					],
					discount: 0,
					quantity: 321,
					sellerId: "7321d946-7265-45a1-9ce3-3da1789e657e",
					categoryId: "8dfe453c-b779-453c-b96e-afe656eeebab",
					expiryDate: "2324-04-30T00:00:00.000Z",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "9e555bd6-0f36-454a-a3d5-89edef4ff9d6",
					name: "potato",
					price: 49,
					images: [
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877715/e-commerce/cx03adwvxevuvxxeewyv.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877717/e-commerce/r7h5yvc5nbdtjt5yqoua.jpg",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877719/e-commerce/pegxb75y2c7x6rwtmrho.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877721/e-commerce/biqpzdojtmbv0z55bhew.png",
					],
					discount: 0,
					quantity: 197,
					sellerId: "7321d946-7265-45a1-9ce3-3da1789e657e",
					categoryId: "8dfe453c-b779-453c-b96e-afe656eeebab",
					expiryDate: "2324-04-30T00:00:00.000Z",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "9e555bd6-0f36-454a-a3d5-89edef4ff9d5",
					name: "dark mango",
					price: 11,
					images: [
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877715/e-commerce/cx03adwvxevuvxxeewyv.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877717/e-commerce/r7h5yvc5nbdtjt5yqoua.jpg",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877719/e-commerce/pegxb75y2c7x6rwtmrho.png",
						"https://res.cloudinary.com/dzbxg4xeq/image/upload/v1713877721/e-commerce/biqpzdojtmbv0z55bhew.png",
					],
					discount: 8,
					quantity: 141,
					sellerId: "7321d946-7265-45a1-9ce3-3da1789e657e",
					categoryId: "8dfe453c-b779-453c-b96e-afe656eeebab",
					expiryDate: "2324-04-30T00:00:00.000Z",
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("products", null, {});
	},
};
