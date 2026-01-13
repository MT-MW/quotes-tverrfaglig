const express = require('express');
const defaultController = require('../controllers/defaultController');
const middleware = require('../middleware/auth');
const router = express.Router();

router.get('/', m