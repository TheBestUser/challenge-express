'use strict';

const { TaskQueueService } = require('./task-queue');
const { delay } = require('../../utils');
const { TaskManagerService } = require('./task-manager');

const WATCH_TASKS_DELAY_MS = 30 * 1000; // check new tasks every 30 sec
const TASKS_THROTTLE_MS = 2 * 60 * 1000; // mock task processing for 2 min

const TASK_HEARTBEAT_MS = 5 * 1000;

const TaskHandlerService = {
  tryNext: () => {},
};

/**
 * @param {Task} queueTask
 * @returns {Promise<void>}
 */
const runTask = async queueTask => {
  const task = TaskManagerService.getTaskByName(queueTask.name);

  if (!task) {
    return;
  }

  console.log(`Task "${task.name}" started.`);

  const throttle = new Promise(resolve => {
    setTimeout(resolve, TASKS_THROTTLE_MS);
  });

  const interval = setInterval(
    () => TaskQueueService.heartbeatTask(queueTask.id),
    TASK_HEARTBEAT_MS,
  );

  try {
    await task.process();
    await throttle;
  } finally {
    clearInterval(interval);
  }

  console.log(`Task "${task.name}" finished.`);
};

const watchTasks = async () => {
  while (true) {
    await delay(100);

    const task = await TaskQueueService.getNextTask();

    if (task) {
      runTask(task).then(
        () => {
          TaskQueueService.finishTask(task.id);
        },
        err => {
          console.log(err);
          TaskQueueService.finishTask(task.id, err.message);
        },
      );

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

const IS_TASK_WORKER = process.env.IS_TASK_WORKER === 'true';

if (IS_TASK_WORKER) {
  watchTasks();
}

module.exports = { TaskHandlerService };
