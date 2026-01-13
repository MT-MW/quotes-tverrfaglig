const express = require('express');
const profileController = require('../controllers/profileController');
const router = express.Router();

router.get('/sign-up', profileController.signupGET);
router.post('/sign-up', profileController.signupPOST);
router.get('/log-in', profileController.loginGET);
router.post('/log-in', profileController.loginPOST);

module.exports = router;