const express = require('express');
const router = express.Router();

const { feriados, store ,schedule, storeSchedule, isFeriado, update} = require('../controllers/daysController')

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

router.get('/holy',isAuthenticatedUser, feriados);
router.post('/holy',isAuthenticatedUser, store);
router.put('/holy',isAuthenticatedUser, update);
router.post('/holiday',isAuthenticatedUser, isFeriado);
router.get('/schedule',isAuthenticatedUser, schedule);
router.put('/schedule',isAuthenticatedUser, storeSchedule);

module.exports = router