/* eslint-disable no-undef */
const express = require('express');
const authController = require('./auth.controller');
const router = express.Router();

router.get('/google/secrets', authController.googleAuth);

module.exports = router;