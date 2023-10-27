'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('purchases', 'retailAmount', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('purchases', 'token', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn('purchases', 'purchaseDate', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('marketPlaces', 'relativePercentage', {
      type: Sequelize.INTEGER,
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('purchases', 'retailAmount', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeColumn('purchases', 'token', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.removeColumn('purchases', 'purchaseDate', {
      type: Sequelize.DATE,
    });
    await queryInterface.removeColumn('marketPlaces', 'relativePercentage', {
      type: Sequelize.INTEGER,
    });
  },
};
