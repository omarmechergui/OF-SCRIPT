const express = require('express');
const { getBadges } = require('../controllers/badges.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);
router.get('/', getBadges);

module.exports = router;
