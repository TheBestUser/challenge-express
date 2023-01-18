'use strict';

const { User, sequelize } = require('../../db');
const { AppError } = require('../types');

const UserService = {
  updateBalance: async (userId, amount) => {
    return await sequelize.transaction(async transaction => {
      const user = await User.findByPk(userId, { transaction, lock: true });

      if (!user) {
        throw new AppError('User not found');
      }

      if (user.balance < amount) {
        throw new AppError('Insufficient funds');
      }

      user.balance += amount;

      return await user.save({ transaction });
    });
  },
};

module.exports = { UserService };
