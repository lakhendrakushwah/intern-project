'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'marketplaceProducts', // table name
        'marketPricePerUnit', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      ),
      queryInterface.addColumn(
        'marketplaceProducts', // table name
        'specialMarketPrice', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      ),
      queryInterface.addColumn(
        'marketplaceProducts', // table name
        'specialEasePrice', // new field name
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      ),
      queryInterface.addColumn(
        'marketplaceProducts', // table name
        'type', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
