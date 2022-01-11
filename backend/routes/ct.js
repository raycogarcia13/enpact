const express = require('express');
const router = express.Router();

const { get ,store, times, getadmin, storeadmin  } = require('../controllers/ctController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.post('/ct',isAuthenticatedUser, get);
router.put('/ct',isAuthenticatedUser, store);
router.post('/times',isAuthenticatedUser, times);
router.post('/ct_admin',isAuthenticatedUser, getadmin);
router.put('/ct_admin',isAuthenticatedUser, storeadmin);

module.exports = router