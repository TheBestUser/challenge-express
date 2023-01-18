'use strict';

const { AppError } = require('../types/errors');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let status = 500;
  let body = {
    success: false,
    message: err.message,
  };

  if (err instanceof AppError) {
    status = err.status;

    if (err.errors.length) {
      body.errors = err.errors;
    }
  }

  res.status(status).json(body);
}

module.exports = errorHandler;
