'use strict';

const { createConnection, Task, Sequelize } = require('../../../db');
const { getHostname } = require('../../utils');
const { AppError } = require('../../types');

const queueSequelize = createConnection({
  pool: {
    max: 1,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const TaskQueueService = {
  pushTask: async taskName => {
    return await Task.create({
      name: taskName,
    });
  },

  /**
   * @returns {Promise<Task | undefined>}
   */
  getNextTask: async () => {
    return await queueSequelize.transaction(async transaction => {
      const task = await Task.findOne({
        where: {
          startedAt: {
            [Sequelize.Op.eq]: null,
          },
        },
        transaction,
        lock: true,
        skipLocked: true,
      });

      if (!task) {
        return undefined;
      }

      task.worker = getHostname();
      task.startedAt = new Date();
      task.lastHeartbeatAt = new Date();

      await task.save({ transaction });

      return task;
    });
  },

  /**
   * @param {string} taskId
   * @param {string} [error]
   * @returns {Promise<void>}
   */
  finishTask: async (taskId, error) => {
    return await queueSequelize.transaction(async transaction => {
      const task = await Task.findByPk(taskId, { transaction, lock: true });

      if (!task) {
        throw new AppError('Task not found', 400, [{ taskId }]);
      }

      if (task.finishedAt) {
        throw new AppError('Task already finished', 400, [{ taskId }]);
      }

      task.finishedAt = new Date();

      if (error != null) {
        task.error = error;
      }

      await task.save({ transaction });
    });
  },

  /**
   * @param {string} taskId
   * @returns {Promise<void>}
   */
  heartbeatTask: async taskId => {
    return await queueSequelize.transaction(async transaction => {
      const task = await Task.findByPk(taskId, { transaction, lock: true });

      if (!task) {
        throw new AppError('Task not found', 400, [{ taskId }]);
      }

      if (task.finishedAt) {
        throw new AppError('Task already finished', 400, [{ taskId }]);
      }

      task.lastHeartbeatAt = new Date();

      await task.save({ transaction });
    });
  },
};

const BROKEN_TASK_TTL_MS = 60 * 1000; // 1 min

const cleanBrokenTasks = async () => {
  console.debug('Clean started.');
  const lastHeartbeatThreshold = Date.now() - BROKEN_TASK_TTL_MS;

  await Task.update(
    {
      finishedAt: new Date(),
      error: 'Heartbeat lost',
    },
    {
      where: {
        startedAt: {
          [Sequelize.Op.not]: null,
        },
        finishedAt: {
          [Sequelize.Op.eq]: null,
        },
        lastHeartbeatAt: {
          [Sequelize.Op.lte]: new Date(lastHeartbeatThreshold),
        },
      },
    },
  );
  console.debug('Clean finished.');
};

const IS_TASK_WORKER = process.env.IS_TASK_QUEUE_MANAGER === 'true';

if (IS_TASK_WORKER) {
  setInterval(cleanBrokenTasks, BROKEN_TASK_TTL_MS);
}

module.exports = {
  TaskQueueService,
};
