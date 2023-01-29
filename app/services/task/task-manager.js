'use strict';

/**
 * @typedef {Object} CronTask
 * @property {string} name
 * @property {string} expression
 * @property {() => Promise<void> | void} process
 */

const TASKS_SCALE = process.env.TASKS_SCALE || 10;

const tasks = Array.from({ length: TASKS_SCALE }, (_v, i) => {
  const name = `task-${i}`;
  return {
    name,
    expression: '* * * * *', // every minute
    process: () => {
      console.log(`Processing task "${name}"...`);
    },
  };
});

/**
 * @type {Map<string, CronTask>} - key: task name
 */
const taskByName = new Map(tasks.map(task => [task.name, task]));

const TaskManagerService = {
  /**
   * @returns {CronTask[]}
   */
  getTasks: () => [...taskByName.values()],
  /**
   * @param {string} taskName
   * @returns {CronTask}
   */
  getTaskByName: taskName => taskByName.get(taskName),
};

module.exports = { TaskManagerService };
