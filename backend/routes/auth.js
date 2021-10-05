const express = require('express');
const router = express.Router();

const { login, logout, refreshUser } = require('../controllers/authController')

const { isAuthenticatedUser } = require("../middlewares/auth")

router.post('/login', login);
router.get('/logout', isAuthenticatedUser, logout);
router.get('/refreshUser', refreshUser);

module.exports = router