'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payments.init({
    userId: DataTypes.INTEGER,
    marketplaceId: DataTypes.INTEGER,
    marketplaceName: DataTypes.STRING,
    productId: DataTypes.INTEGER,
    productName: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    status: DataTypes.STRING,
    noOfLicences: DataTypes.INTEGER,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payments',
  });
  return payments;
};