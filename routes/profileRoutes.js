const express = require('express');
const profileController = require('../controllers/profileController');
const middleware = require('../middleware/auth');
const router = express.Router();

router.get('/sign-up', profileController.signupGET);
router.post('/sign-up', profileController.signupPOST);
router.get('/log-in', profileController.loginGET);
router.post('/log-in', profileController.loginPOST);
router.post('/log-out', profileController.logout);
router.get('/home/:username', middleware.authenticate, profileController.home);

module.exports = router;