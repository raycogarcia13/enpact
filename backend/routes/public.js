const express = require('express');
const router = express.Router();

const { viewCard, home } = require('../controllers/publicController')

router.get('/:id', viewCard);
router.get('/', home);

module.exports = router