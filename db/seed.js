'use strict';

const demoUserSeeder = require('./seeders/20230118110829-demo-user');

async function seed(sequelize, Sequelize) {
  await demoUserSeeder.up(sequelize.getQueryInterface(), Sequelize);
}

module.exports = seed;
