'use strict';

const cron = require('node-cron');
const { TaskQueueService } = require('./task-queue');
const { TaskHandlerService } = require('./task-handler');
const { TaskManagerService } = require('./task-manager');

const IS_TASK_PRODUCER = process.env.IS_TASK_PRODUCER !== 'false';

/**
 * Schedule task
 * @param {CronTask} task
 */
const scheduleTask = task => {
  cron.schedule(task.expression, async () => {
    try {
      await TaskQueueService.pushTask(task.name);
    } catch (err) {
      console.error('Task already exists');
    }

    TaskHandlerService.tryNext();
  });
};

const startCron = () => {
  console.log('startCron');

  const tasks = TaskManagerService.getTasks();

  for (const task of tasks) {
    scheduleTask(task);
  }
};

if (IS_TASK_PRODUCER) {
  startCron();
}
