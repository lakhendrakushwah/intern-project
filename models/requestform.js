'use strict';
const {
  Model, ENUM
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class requestForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  requestForm.init({
    name: DataTypes.STRING,
    requestEmail: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    marketPlaceId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    metaData: DataTypes.JSON,
    status:DataTypes.ENUM('pending','underProcess','accepted','rejected'),
    otherId:DataTypes.INTEGER,
    otherData:DataTypes.STRING    
  }, {
    sequelize,
    modelName: 'requestForm',
  });
  return requestForm;
};