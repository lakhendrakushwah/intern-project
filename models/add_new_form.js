'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class add_new_form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  add_new_form.init({
    name: DataTypes.STRING,
    link: DataTypes.STRING,
    requestEmail: DataTypes.STRING,
    metaData: DataTypes.JSON,
    username: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'add_new_form',
  });
  return add_new_form;
};