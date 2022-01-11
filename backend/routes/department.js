const express = require('express');
const router = express.Router();

const { all, find, store , update, getLeader} = require('../controllers/departmentController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.get('/department',isAuthenticatedUser, all);
router.get('/getLeader',isAuthenticatedUser, getLeader);
router.get('/department/:id',isAuthenticatedUser, find);
router.post('/department',isAuthenticatedUser,authorizeRoles('CTJefe','CTRRHH'), store);
router.put('/department/:id',isAuthenticatedUser,authorizeRoles('CTJefe','CTRRHH'),update);

module.exports = router