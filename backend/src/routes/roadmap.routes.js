const express = require('express');
const { getRoadmap } = require('../controllers/roadmap.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);
router.get('/', getRoadmap);

module.exports = router;
