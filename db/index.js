'use strict';

const Sequelize = require('sequelize');
const process = require('process');
const migrate = require('./migrate');
const seed = require('./seed');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.json')[env];

config.host = process.env.PG_HOST || config.host;

/**
 * @param {Partial<import('sequelize').Config>} options
 * @returns {import('sequelize').Sequelize}
 */
const createConnection = (options = {}) => {
  const configObj = {
    ...config,
    ...options,
  };

  return config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], configObj)
    : new Sequelize(
        config.database,
        config.username,
        config.password,
        configObj,
      );
};

const sequelize = createConnection();

const models = {
  User: require('./models/user')(sequelize, Sequelize),
  Task: require('./models/task')(sequelize, Sequelize),
};

const bootstrap = async () => {
  await migrate(sequelize, Sequelize);
  await seed(sequelize, Sequelize);
};

module.exports = {
  sequelize,
  Sequelize,
  bootstrap,
  createConnection,
  ...models,
};
