'use strict';

class AppError extends Error {
  /**
   * @param {string=} message
   * @param {number=} status
   * @param  {Object[]=} errors
   */
  constructor(message = 'An error occurred', status = 500, errors = []) {
    super(message);

    this.status = status;
    this.errors = errors;
  }
}

module.exports = {
  AppError,
};
