'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    userName:DataTypes.STRING,
    firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      contactId: DataTypes.STRING,
      password: DataTypes.STRING,
      customerId: DataTypes.STRING,
      currentRegion:DataTypes.INTEGER,
      role: DataTypes.ENUM("gust", "admin", "super"),
      plan: DataTypes.ENUM("free", "paid", "gust", "trial"),
      email_verified: DataTypes.ENUM("0", "1"),
      phone_verified: DataTypes.ENUM("0", "1"),
      type:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};