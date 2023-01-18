'use strict';

const { User, sequelize, Sequelize } = require('../../db');
const { AppError } = require('../types');

const UserService = {
  /**
   * requests: 10000
   * ex. time: ~5s
   */
  updateBalance: async (userId, amount) => {
    const balance =
      amount < 0 ? { balance: { [Sequelize.Op.gte]: Math.abs(amount) } } : {};

    const [res] = await User.increment(
      { balance: amount },
      { where: { id: userId, ...balance } },
    );

    const [[data], count] = res;

    if (!count) {
      throw new AppError('Unable to update balance', 403);
    }

    return data;
  },

  /**
   * too slow
   * requests: 10000
   * ex. time: ~25s
   */
  updateBalanceSlow: async (userId, amount) => {
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
