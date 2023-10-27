'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  purchase.init({
    userId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    marketPlaceId: DataTypes.INTEGER,
    invoiceId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    planInterval:DataTypes.ENUM('free','paid','gust','trial','monthly','yearly','oneTime','biannual','quarterly','lifeTime','prepaid','postpaid'),
    currency: DataTypes.STRING,
    expireOn: DataTypes.DATE,
    nextAmount: DataTypes.FLOAT,
    assignUserId: DataTypes.INTEGER,
    otherInfo: DataTypes.STRING,
    metaData: DataTypes.JSON,
    deletedAt: DataTypes.DATE,
    retailAmount: DataTypes.FLOAT,
    token: DataTypes.INTEGER,
    purchaseDate: DataTypes.DATE,
    MarketPlaceName: DataTypes.STRING,
    LogoLink: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'purchase',
  });
  return purchase;
};