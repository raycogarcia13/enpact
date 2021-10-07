const express = require('express');
const router = express.Router();

const { all, find, getByDepartment , setDpto, getOnly} = require('../controllers/projectorController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.get('/projector',isAuthenticatedUser, all);
router.get('/projector_only',isAuthenticatedUser, getOnly);
router.get('/projector/:id',isAuthenticatedUser, find);
router.get('/projector/department/:id',isAuthenticatedUser, getByDepartment);
router.put('/projector/:id/department',isAuthenticatedUser,authorizeRoles('CTJefe'), setDpto);

module.exports = router