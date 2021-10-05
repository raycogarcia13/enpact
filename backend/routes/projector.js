const express = require('express');
const router = express.Router();

const { all, find, getByDepartment , setDpto} = require('../controllers/projectorController')

const { isAuthenticatedUser, authorizeRole } = require("../middlewares/auth")

// router.get('/logout', isAuthenticatedUser, authorizeRole('Admin'), logout);
router.get('/projector', all);
router.get('/projector/:id', find);
router.get('/projector/department/:id', getByDepartment);
router.put('/projector/:id/department', setDpto);

module.exports = router