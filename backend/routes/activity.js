const express = require('express');
const router = express.Router();

const { get ,all, store, update, remove} = require('../controllers/activityController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.get('/activity',isAuthenticatedUser, get);
router.get('/activity_all',isAuthenticatedUser,authorizeRoles('CTJefe','CTRRHH'), all);
router.post('/activity',isAuthenticatedUser, authorizeRoles('CTJefe','CTRRHH'), store);
router.put('/activity/:id',isAuthenticatedUser, authorizeRoles('CTJefe','CTRRHH'),update);
router.delete('/activity/:id',isAuthenticatedUser, authorizeRoles('CTJefe','CTRRHH'),remove);

module.exports = router