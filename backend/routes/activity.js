const express = require('express');
const router = express.Router();

const { get ,all, store, update, remove} = require('../controllers/activityController')

const { isAuthenticatedUser, authorizeRole } = require("../middlewares/auth")

// router.get('/logout', isAuthenticatedUser, authorizeRole('Admin'), logout);
router.get('/activity', get);
router.get('/activity_all', all);
router.post('/activity', store);
router.put('/activity/:id', update);
router.delete('/activity/:id', remove);

module.exports = router