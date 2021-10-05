const express = require('express');
const router = express.Router();

const { get ,all, find,store, update, remove} = require('../controllers/projectController')

const { isAuthenticatedUser, authorizeRole } = require("../middlewares/auth")

// router.get('/logout', isAuthenticatedUser, authorizeRole('Admin'), logout);
router.get('/project', get);
router.get('/project_all', all);
router.get('/project/:id', find);
router.post('/project', store);
router.put('/project/:id', update);
router.delete('/project/:id', remove);

module.exports = router