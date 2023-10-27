'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchases', 'MarketPlaceName', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('purchases', 'logoLink', {
      type: Sequelize.STRING,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('purchases', 'MarketPlaceName', {
      type: Sequelize.STRING,
    });
    await queryInterface.removeColumn('purchases', 'logoLink', {
      type: Sequelize.STRING,
    });
  }
};
