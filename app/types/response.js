'use strict';

class AppResponse {
  constructor(data) {
    this.success = true;
    this.data = data;
  }
}

module.exports = AppResponse;
