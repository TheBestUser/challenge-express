'use strict';

/**
 * @typedef {Object} LockedTask
 * @property {Task} task
 * @property {import('sequelize').Transaction} transaction
 */

const { createConnection, Task, Sequelize } = require('../../../db');
const { getHostname } = require('../../utils');

const queueSequelize = createConnection({
  pool: {
    max: 10,
    min: 0,
    idle: 30000,
    acquire: 5 * 60 * 1000,
  },
});

const TaskQueueService = {
  pushTask: async taskName => {
    return await Task.create({
      name: taskName,
    });
  },

  /**
   * @returns {Promise<LockedTask | undefined>}
   */
  getNextTask: async () => {
    const transaction = await queueSequelize.transaction();

    try {
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

      if (task) {
        task.worker = getHostname();
        task.startedAt = new Date();

        await task.save({ transaction });

        return { task, transaction };
      }

      await transaction.rollback();
    } catch (err) {
      await transaction.rollback();
      console.debug('processNextTask: ', err);
    }

    return undefined;
  },

  /**
   * @param {LockedTask} lockedTask
   * @returns {Promise<void>}
   */
  finishTask: async lockedTask => {
    const { task, transaction } = lockedTask;

    try {
      task.finishedAt = new Date();
      await task.save({ transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.debug('finishTask: ', err);
    }
  },
};

module.exports = {
  TaskQueueService,
};
