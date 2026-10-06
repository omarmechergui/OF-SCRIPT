const express = require('express');
const { getCompetitions, getCompetition, registerForCompetition, cancelRegistration, submitCompetitionEntry } = require('../controllers/competitions.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authenticate);
router.get('/', getCompetitions);
router.get('/:id', getCompetition);
router.post('/:id/register', registerForCompetition);
router.delete('/:id/register', cancelRegistration);
router.post('/:id/submissions', submitCompetitionEntry);

module.exports = router;
