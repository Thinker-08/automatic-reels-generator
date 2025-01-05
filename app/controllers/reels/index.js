/* eslint-disable no-undef */
const express = require('express');
const reelsController = require('./reels.controller');
const router = express.Router();

router.get('/create', reelsController.generateReels);

module.exports = router;