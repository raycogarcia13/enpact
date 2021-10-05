const express = require('express');
const router = express.Router();

const { get ,all, find,store, update, remove, setProjectors, removeProjectors} = require('../controllers/serviceController')

const { isAuthenticatedUser, authorizeRole } = require("../middlewares/auth")

// router.get('/logout', isAuthenticatedUser, authorizeRole('Admin'), logout);
router.get('/services', get);
router.get('/services_all', all);
router.get('/services/:id', find);
router.post('/services', store);
router.put('/services/:id', update);
router.delete('/services/:id', remove);
router.put('/services/:id/team', setProjectors);
router.delete('/services/:id/team', removeProjectors);

module.exports = router