"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        { id:"11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd", 
          userName: "DevBonheur",
          firstName:"Kwizera",
          lastName:"Bonheur",
          email: "kwizera.bonheur@example.com",
          password: "passwordQWE123",
          confirmPassword:"passwordQWE123",
          role:"BUYER",
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
