const express = require('express');
const { getAssignments, getAssignment, submitAssignment } = require('../controllers/assignments.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);
router.get('/', getAssignments);
router.get('/:id', getAssignment);
router.post('/:id/submissions', submitAssignment);

module.exports = router;
