'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userRoles', {
      id: {
        type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
				allowNull: false,
      },
      roleId: {
        type: Sequelize.UUID,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',        
        },
      },
      roleName: {
        type: Sequelize.STRING,
        references: {
          model: 'roles',
          key: 'roleName',        
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('userRoles');
  }
};