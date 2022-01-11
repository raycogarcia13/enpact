const express = require('express');
const router = express.Router();

const { openMonth, closeMonth,readyClose } = require('../controllers/cierreController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.post('/month',isAuthenticatedUser,authorizeRoles('CTRRHH'), openMonth);
router.put('/month/:month/:year',isAuthenticatedUser,authorizeRoles('CTRRHH'), closeMonth);
router.get('/month/:month/:year',isAuthenticatedUser,authorizeRoles('CTRRHH'), readyClose);

module.exports = router