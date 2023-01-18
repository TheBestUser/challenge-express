'use strict';

const router = require('express').Router();
const { UserService } = require('../../services/user');
const { check, validationResult } = require('express-validator');
const { AppResponse, AppError } = require('../../types');

router.post(
  '/update-balance',
  [check('userId').isInt(), check('amount').isInt().not().equals('0')],
  async (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return next(
        new AppError('Validation Error', 403, validationErrors.array()),
      );
    }

    try {
      const data = await UserService.updateBalance(
        +req.body.userId,
        +req.body.amount,
      );

      res.status(200).json(new AppResponse(data));
    } catch (error) {
      return next(error);
    }
  },
);

module.exports = router;
