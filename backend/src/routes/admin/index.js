const express = require('express');
const { requireRole } = require('../../middleware/role.middleware');
const { getDashboardStats } = require('../../controllers/admin/dashboard.controller');
const { getUsers, getUser, updateUser } = require('../../controllers/admin/users.controller');
const { getProjects, createProject, updateProject, deleteProject } = require('../../controllers/admin/projects.controller');
const { getCompetitions, createCompetition, updateCompetition, deleteCompetition } = require('../../controllers/admin/competitions.controller');
const { getBadges, createBadge, updateBadge } = require('../../controllers/admin/badges.controller');
const { getRewardRules, createRewardRule, updateRewardRule } = require('../../controllers/admin/rewards.controller');
const { adjustPoints } = require('../../controllers/admin/points.controller');
const { getAuditLogs } = require('../../controllers/admin/audit.controller');

const router = express.Router();

// Require ADMIN role for all routes in this router
router.use(requireRole('ADMIN'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateUser);

// Projects
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.patch('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Competitions
router.get('/competitions', getCompetitions);
router.post('/competitions', createCompetition);
router.patch('/competitions/:id', updateCompetition);
router.delete('/competitions/:id', deleteCompetition);

// Badges
router.get('/badges', getBadges);
router.post('/badges', createBadge);
router.patch('/badges/:id', updateBadge);

// Reward Rules
router.get('/rewards', getRewardRules);
router.post('/rewards', createRewardRule);
router.patch('/rewards/:id', updateRewardRule);

// Points
router.post('/points/adjust', adjustPoints);

// Audit Logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;
