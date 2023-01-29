'use strict';

const { Router } = require('express');

const router = Router();
const { AppResponse } = require('../../types');
const { TaskService } = require('../../services');

router.get('/', async (req, res, next) => {
  try {
    const data = await TaskService.getActiveTasks();

    res.status(200).json(new AppResponse(data));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
