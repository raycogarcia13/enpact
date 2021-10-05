const express = require('express');
const router = express.Router();

const { all, find, store , update} = require('../controllers/departmentController')

const { isAuthenticatedUser, authorizeRole } = require("../middlewares/auth")

// router.get('/logout', isAuthenticatedUser, authorizeRole('Admin'), logout);
router.get('/department', all);
router.get('/department/:id', find);
router.post('/department', store);
router.put('/department/:id', update);

module.exports = router