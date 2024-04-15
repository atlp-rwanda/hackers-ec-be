"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          fullName: "Kwizera Bonheur",
          email: "kwizera.bonheur@example.com",
          password: "123",
          role: "buyer",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          fullName: "John Doe",
          email: "john.doe@example.com",
          password: "password",
          role: "buyer",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
