'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = require("../config/db-config.js");
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logging: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: false
});
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = require('./user')(sequelize, Sequelize)
db.forgetPassword = require('./forgetpassword')(sequelize, Sequelize)
db.marketPlace = require('./marketplace')(sequelize, Sequelize)
db.marketPlaceProduct = require('./marketplaceproduct')(sequelize, Sequelize)
db.subscription = require('./subscriptions')(sequelize, Sequelize)
db.payment = require('./payments')(sequelize, Sequelize)
db.purchase = require('./purchase')(sequelize, Sequelize)
db.support = require('./support')(sequelize, Sequelize)
db.region = require('./region')(sequelize, Sequelize)
db.add_new_form = require('./add_new_form')(sequelize, Sequelize)
module.exports = db;
