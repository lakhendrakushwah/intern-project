'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class marketPlace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  marketPlace.init({
    name: DataTypes.STRING,
    provide: DataTypes.STRING,
    type1: DataTypes.STRING,
    type2: DataTypes.JSON,
    logoLink: DataTypes.STRING,
    info: DataTypes.STRING,
    metaData: DataTypes.JSON,
    feature: DataTypes.JSON,
    planInterval:DataTypes.ENUM('free','paid','gust','trial','monthly','yearly','oneTime','biannual','quarterly','lifeTime','prepaid','postpaid'),
    deletedAt: DataTypes.DATE,
    relativePercentage: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'marketPlace',
  });
  return marketPlace;
};