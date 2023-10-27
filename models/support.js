'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class support extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  support.init({
    userid: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'support',
  });
  return support;
};