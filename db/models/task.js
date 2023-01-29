'use strict';
const { Model } = require('sequelize');

/**
 *
 * @param sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {*}
 */
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {}

  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      startedAt: {
        type: DataTypes.DATE,
      },
      worker: {
        type: DataTypes.TEXT,
      },
      finishedAt: {
        type: DataTypes.DATE,
      },
      lastHeartbeatAt: {
        type: DataTypes.DATE,
      },
      error: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'tasks',
      timestamps: false,
    },
  );

  return Task;
};
