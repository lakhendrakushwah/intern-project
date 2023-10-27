'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      marketPlaceId: {
        type: Sequelize.INTEGER
      },
      invoiceId: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER
      },
      planInterval: {
        type: Sequelize.ENUM,
        values: ['free','paid','gust','trial','monthly','yearly','oneTime','biannual','quarterly','lifeTime','prepaid','postpaid'],
      },
      currency: {
        type: Sequelize.STRING
      },
      expireOn: {
        type: Sequelize.DATE
      },
      nextAmount: {
        type: Sequelize.INTEGER
      },
      assignUserId: {
        type: Sequelize.INTEGER
      },
      otherInfo: {
        type: Sequelize.STRING
      },
      metaData: {
        type: Sequelize.JSON
      },
      deletedAt: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('purchases');
  }
};