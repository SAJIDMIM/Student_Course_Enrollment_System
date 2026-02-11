const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/loginController');
const { validateLogin } = require('../middleware/middleware');

// POST /api/login
router.post('/login', validateLogin, LoginController.login);

module.exports = router;
