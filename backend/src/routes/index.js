const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');

const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const roadmapRoutes = require('./roadmap.routes');
const sessionRoutes = require('./sessions.routes');
const assignmentRoutes = require('./assignments.routes');
const projectRoutes = require('./projects.routes');
const competitionRoutes = require('./competitions.routes');
const badgeRoutes = require('./badges.routes');
const pointRoutes = require('./points.routes');

const adminRoutes = require('./admin');

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'OFFSCRIPT API is running' });
});

router.use('/auth', authRoutes);

// Admin routes (requires authentication, role check is inside the router)
router.use('/admin', authenticate, adminRoutes);

// Member routes (authentication is handled inside each router)
router.use('/dashboard', dashboardRoutes);
router.use('/roadmap', roadmapRoutes);
router.use('/sessions', sessionRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/projects', projectRoutes);
router.use('/competitions', competitionRoutes);
router.use('/badges', badgeRoutes);
router.use('/points', pointRoutes);

module.exports = router;
