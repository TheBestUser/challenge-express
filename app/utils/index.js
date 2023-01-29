'use strict';

const os = require('os');

const getHostname = () => `${os.hostname()}-${process.pid}`;

const delay = delayMs =>
  new Promise(resolve => {
    setTimeout(resolve, delayMs);
  });

module.exports = {
  getHostname,
  delay,
};
