const express = require('express');
const { getProjects, getProject, startProject, submitProject } = require('../controllers/projects.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);
router.get('/', getProjects);
router.get('/:id', getProject);
router.patch('/:id/progress', startProject);
router.post('/:id/submissions', submitProject);

module.exports = router;
