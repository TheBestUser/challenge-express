'use strict';

const Sequelize = require('sequelize');
const process = require('process');
const migrate = require('./migrate');
const seed = require('./seed');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.json')[env];

config.host = process.env.PG_HOST || config.host;

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

const User = require('./models/user')(sequelize, Sequelize);

const bootstrap = async () => {
  await migrate(sequelize, Sequelize);
  await seed(sequelize, Sequelize);
};

module.exports = {
  sequelize,
  Sequelize,
  bootstrap,
  User,
};
