const bcrypt = require("bcrypt");
const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPass = await bcrypt.hash(password, salt);
	return hashedPass;
};
("use strict");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert(
			"users",
			[
				{
					id: "7121d946-7265-45a1-9ce3-3da1789e657e",
					firstName: "prince",
					lastName: "hatungi",
					userName: "hat",
					email: "princeBuyer@gmail.com",
					password: await hashPassword("longPassWORD123"),
					confirmPassword: await hashPassword("longPassWORD123"),
					role: "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					isVerified: true,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "7221d946-7265-45a1-9ce3-3da1789e657e",
					firstName: "aline",
					lastName: "uwimana",
					userName: "aline",
					email: "alineAdmin@gmail.com",
					password: await hashPassword("longPassWORD123"),
					confirmPassword: await hashPassword("longPassWORD123"),
					role: "12afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					isVerified: true,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "7321d946-7265-45a1-9ce3-3da1789e657e",
					firstName: "tito",
					lastName: "tuyisenge",
					userName: "tite",
					email: "titoSeller@gmail.com",
					password: await hashPassword("longPassWORD123"),
					confirmPassword: await hashPassword("longPassWORD123"),
					role: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					isVerified: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: "1001d946-7265-45a1-9ce3-3da1789e100a",
					firstName: "Aphrodis",
					lastName: "Uwineza",
					userName: "aphro",
					email: "aphro@gmail.com",
					password: await hashPassword("longPassWORD123"),
					confirmPassword: await hashPassword("longPassWORD123"),
					role: "13afd4f1-0bed-4a3b-8ad5-0978dabf8fcd",
					isVerified: false,
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{},
		);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete("users", null, {});
	},
};
