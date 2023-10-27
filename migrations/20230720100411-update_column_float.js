'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('purchases', 'amount', {
      type: Sequelize.FLOAT,
    });
    await queryInterface.changeColumn('purchases', 'retailAmount', {
      type: Sequelize.FLOAT,
    });
    await queryInterface.changeColumn('purchases', 'nextAmount', {
      type: Sequelize.FLOAT,
    });
  },
  

  down: async (queryInterface, Sequelize) => {
    // If needed, you can revert the changes in the 'down' function
    await queryInterface.changeColumn('purchases', 'amount', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.changeColumn('purchases', 'retailAmount', {
      type: Sequelize.INTEGER,
    });
    await queryInterface.changeColumn('purchases', 'nextAmount', {
      type: Sequelize.INTEGER,
    });
  },
};