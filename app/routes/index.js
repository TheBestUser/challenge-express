'use strict';

const { AppError } = require('../types');
const router = require('express').Router();

function notFound(req, res, next) {
  next(new AppError('Not Found', 404));
}

router.use('/api', require('./api'));
router.use('/api', notFound);

module.exports = router;
