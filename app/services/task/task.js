'use strict';

const { Task, Sequelize, sequelize } = require('../../../db');

const TaskService = {
  getActiveTasks: async () => {
    const tasks = await sequelize.transaction(
      // PG doesn't support dirty read :^(
      {
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      },
      async transaction => {
        return await Task.findAll({
          attributes: ['name', 'worker', 'startedAt'],
          where: {
            startedAt: {
              [Sequelize.Op.not]: null,
            },
            finishedAt: {
              [Sequelize.Op.eq]: null,
            },
          },
          transaction,
        });
      },
    );

    // return tasks.map(({name, worker, startedAt}) => ({name, worker, startedAt}));
    return tasks;
  },
};

module.exports = { TaskService };
