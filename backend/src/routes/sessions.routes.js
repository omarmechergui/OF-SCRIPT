const express = require('express');
const { getSession, updateProgress } = require('../controllers/sessions.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);
router.get('/:id', getSession);
router.patch('/:id/progress', updateProgress);

module.exports = router;
