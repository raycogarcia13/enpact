const express = require('express');
const router = express.Router();

const { get ,store } = require('../controllers/ctController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.post('/ct',isAuthenticatedUser, get);
router.put('/ct',isAuthenticatedUser, store);

module.exports = router