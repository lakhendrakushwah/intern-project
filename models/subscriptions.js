'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  subscriptions.init({
    userId: DataTypes.INTEGER,
    marketplaceId: DataTypes.INTEGER,
    marketplaceName: DataTypes.STRING,
    productId: DataTypes.INTEGER,
    productName: DataTypes.STRING,
    noOfLicences: DataTypes.INTEGER,
    chargePerMonth: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    active: DataTypes.STRING,
    autoRenew: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'subscriptions',
  });
  return subscriptions;
};