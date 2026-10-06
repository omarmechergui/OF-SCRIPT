const express = require('express');
const { getPoints } = require('../controllers/points.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);
router.get('/', getPoints);

module.exports = router;
