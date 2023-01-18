'use strict';

const router = require('express').Router();
const { UserService } = require('../../services/user');

router.post('/update-balance', async (req, res, next) => {
  try {
    await UserService.updateBalance(+req.body.userId, +req.body.amount);
  } catch (error) {
    return next(error);
  }

  res.status(200).end();
});

module.exports = router;
