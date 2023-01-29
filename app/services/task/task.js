'use strict';

const { Task, Sequelize } = require('../../../db');

const MS_IN_SEC = 1000;

const TaskService = {
  getActiveTasks: async () => {
    const tasks = await Task.findAll({
      attributes: ['name', 'worker', 'startedAt'],
      where: {
        startedAt: {
          [Sequelize.Op.not]: null,
        },
        finishedAt: {
          [Sequelize.Op.eq]: null,
        },
      },
    });

    const now = Date.now();

    return tasks.map(({ name, worker, startedAt }) => ({
      taskName: name,
      worker,
      passedSeconds: Math.round((now - startedAt.getTime()) / MS_IN_SEC),
    }));
  },
};

module.exports = { TaskService };
