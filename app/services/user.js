'use strict';

const { User, sequelize } = require('../../db');

const UserService = {
  updateBalance: async (userId, amount) => {
    await sequelize.transaction(async transaction => {
      const user = await User.findByPk(userId, { transaction, lock: true });
      if (!user) {
        throw new Error('User not found');
      }

      if (user.balance < amount) {
        throw new Error('Insufficient funds');
      }

      user.balance += amount;
      await user.save({ transaction });
    });
  },
};

module.exports = { UserService };
