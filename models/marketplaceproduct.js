'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class marketplaceProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  marketplaceProduct.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    pricePerUnit: DataTypes.INTEGER,
    interval: DataTypes.TEXT,
    marketplaceId: DataTypes.INTEGER,
    marketPricePerUnit: DataTypes.INTEGER,
    specialMarketPrice: DataTypes.INTEGER,
    specialEasePrice: DataTypes.INTEGER,
    currency:DataTypes.STRING,
    currentRegion:DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'marketplaceProduct',
  });
  return marketplaceProduct;
};