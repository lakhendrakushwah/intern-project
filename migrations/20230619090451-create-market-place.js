'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('marketPlaces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      provide: {
        type: Sequelize.STRING
      },
      type1: {
        type: Sequelize.STRING
      },
      type2: {
        type: Sequelize.JSON
      },
      logoLink: {
        type: Sequelize.STRING
      },
      info: {
        type: Sequelize.STRING
      },
      metaData: {
        type: Sequelize.JSON
      },
      feature: {
        type: Sequelize.JSON
      },
      planInterval: {
        type: Sequelize.ENUM,
        values: ['free','paid','gust','trial','monthly','yearly','oneTime','biannual','quarterly','lifeTime','prepaid','postpaid'],
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
    await queryInterface.dropTable('marketPlaces');
  }
};