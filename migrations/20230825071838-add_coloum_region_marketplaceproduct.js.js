'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('marketplaceProducts', 'currency', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('marketplaceProducts', 'currentRegion', {
      type: Sequelize.INTEGER,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('marketplaceProducts', 'currency', {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn('marketplaceProducts', 'currentRegion', {
      type: Sequelize.INTEGER,
    });
  }
};
