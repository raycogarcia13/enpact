const express = require('express');
const router = express.Router();

const { get ,all, find,
        store, update, remove, 
        setProjectors, removeProjectors, myServices
     } = require('../controllers/serviceController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

// router.get('/logout', isAuthenticatedUser, authorizeRole('Admin'), logout);
router.get('/services',isAuthenticatedUser, get);
router.get('/services_all',isAuthenticatedUser,authorizeRoles('CTJefe'), all);
router.get('/my_services',isAuthenticatedUser, myServices);
router.get('/services/:id',isAuthenticatedUser, find);
router.post('/services',isAuthenticatedUser, authorizeRoles('CTJefe'),store);
router.put('/services/:id',isAuthenticatedUser,authorizeRoles('CTJefe'), update);
router.delete('/services/:id',isAuthenticatedUser, authorizeRoles('CTJefe'),remove);
router.put('/services/:id/team',isAuthenticatedUser,authorizeRoles('CTJefe'), setProjectors);
router.delete('/services/:id/team', isAuthenticatedUser,authorizeRoles('CTJefe'),removeProjectors);

module.exports = router