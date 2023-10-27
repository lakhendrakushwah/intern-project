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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    community:DataTypes.INTEGER,
    user:DataTypes.INTEGER,
    role:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'marketPlace',
  });
  return marketPlace;
};