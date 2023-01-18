const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');

async function migrate(sequelize, Sequelize) {
  const migrationsDir = path.join(__dirname, 'migrations');
  const umzug = new Umzug({
    migrations: {
      glob: `${migrationsDir}/*.js`,
      resolve: ({ name, path, context }) => {
        const migration = require(path);

        return {
          name,
          up: async () => migration.up(context, Sequelize),
          down: async () => migration.down(context, Sequelize),
        };
      },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  await umzug.up();
}

module.exports = migrate;
