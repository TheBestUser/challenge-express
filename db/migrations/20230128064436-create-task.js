'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable('tasks', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        startedAt: {
          type: Sequelize.DATE,
        },
        worker: {
          type: Sequelize.TEXT,
        },
        finishedAt: {
          type: Sequelize.DATE,
        },
      })
      .then(() => {
        queryInterface.addIndex('tasks', ['name'], {
          type: 'UNIQUE',
          unique: true,
          where: { finishedAt: { [Sequelize.Op.eq]: null } },
        });
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  },
};
