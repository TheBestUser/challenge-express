'use strict';

const { TaskQueueService } = require('./task-queue');
const { delay } = require('../../utils');
const { TaskManagerService } = require('./task-manager');

const IS_WORKER = process.env.IS_WORKER !== 'false';

const WATCH_TASKS_DELAY_MS = 60 * 1000; // check new tasks every 1 min
const TASKS_THROTTLE_MS = 2 * 60 * 1000; // mock task processing for 2 min
// const TASKS_THROTTLE_MS = 10 * 1000;

const TaskHandlerService = {
  tryNext: () => {},
};

const runTask = async taskName => {
  const task = TaskManagerService.getTaskByName(taskName);

  if (!task) {
    return;
  }

  console.log(`Task "${taskName}" started.`);

  const throttle = new Promise(resolve => {
    setTimeout(resolve, TASKS_THROTTLE_MS);
  });

  await task.process();

  await throttle;
  console.log(`Task "${taskName}" finished.`);
};

const watchTasks = async () => {
  while (true) {
    const res = await TaskQueueService.getNextTask();

    if (res) {
      runTask(res.task.name).then(() => {
        TaskQueueService.finishTask(res);
      });

      continue;
    }

    await Promise.race([
      new Promise(resolve => {
        TaskHandlerService.tryNext = resolve;
      }),
      delay(WATCH_TASKS_DELAY_MS),
    ]);
  }
};

if (IS_WORKER) {
  watchTasks();
}

module.exports = { TaskHandlerService };
