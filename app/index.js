'use strict';

const express = require('express');
const { errorHandler } = require('./middlewares');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes'));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
