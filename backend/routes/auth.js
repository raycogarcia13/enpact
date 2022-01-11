const express = require('express');
const router = express.Router();

const { login, login2, logout, refreshUser } = require('../controllers/authController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.post('/login', login2);
router.post('/logout', isAuthenticatedUser, logout);
router.get('/refreshUser',isAuthenticatedUser, authorizeRoles('CTJefe'), refreshUser);

module.exports = router