const express = require('express');
const router = express.Router();

const { get ,all, find,store, update, remove} = require('../controllers/projectController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.get('/project',isAuthenticatedUser, get);
router.get('/project_all',isAuthenticatedUser,authorizeRoles('CTJefe'), all);
router.get('/project/:id',isAuthenticatedUser ,find);
router.post('/project',isAuthenticatedUser,authorizeRoles('CTJefe'), store);
router.put('/project/:id',isAuthenticatedUser,authorizeRoles('CTJefe'), update);
router.delete('/project/:id',isAuthenticatedUser,authorizeRoles('CTJefe'), remove);

module.exports = router