'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      marketplaceId: {
        type: Sequelize.INTEGER
      },
      marketplaceName: {
        type: Sequelize.STRING
      },
      productId: {
        type: Sequelize.INTEGER
      },
      productName: {
        type: Sequelize.STRING
      },
      noOfLicences: {
        type: Sequelize.INTEGER
      },
      chargePerMonth: {
        type: Sequelize.INTEGER
      },
      currency: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.STRING
      },
      autoRenew: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscriptions');
  }
};