const express = require('express');
const router = express.Router();

const { refreshLeader, getUsers } = require('../controllers/ldapController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.get('/refreshLeader',isAuthenticatedUser, authorizeRoles('CTJefe'), refreshLeader);
router.get('/getUsers',isAuthenticatedUser, getUsers);

module.exports = router