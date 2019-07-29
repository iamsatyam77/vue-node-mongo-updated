const express = require('express');
const router = express.Router();

//Controllers routes
const userController = require('../controllers/user.controller');

router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;