const request = require('supertest');
const app = require('../app');
const { getPrismaClient } = require('../config/prisma');

describe('Phase 4 — Gamification API', () => {
  const prisma = getPrismaClient();
  let userACookie, userAId;
  let userBCookie, userBId;
  let project, competition, badge, rewardRule;

  beforeAll(async () => {
    // Create User A
    const emailA = `usera_${Date.now()}@test.com`;
    const resA = await request(app).post('/api/auth/register').send({
      username: 'usera_' + Date.now(),
      email: emailA,
      password: 'Password123!',
      fullName: 'User A'
    });
    userACookie = resA.headers['set-cookie'];
    const userA = await prisma.user.findUnique({ where: { email: emailA } });
    userAId = userA.id;

    // Create User B
    const emailB = `userb_${Date.now() + 1}@test.com`;
    const resB = await request(app).post('/api/auth/register').send({
      username: 'userb_' + (Date.now() + 1),
      email: emailB,
      password: 'Password123!',
      fullName: 'User B'
    });
    userBCookie = resB.headers['set-cookie'];
    const userB = await prisma.user.findUnique({ where: { email: emailB } });
    userBId = userB.id;

    // Create test data
    rewardRule = await prisma.rewardRule.create({
      data: { name: 'Project Reward', description: 'Points for project', points: 100, isActive: true }
    });

    project = await prisma.project.create({
      data: {
        title: 'Test Project',
        slug: 'test-project-' + Date.now(),
        description: 'A test project',
        requirements: 'Build something',
        difficulty: 2,
        status: 'PUBLISHED',
        technologies: ['JavaScript', 'Node.js'],
        rewardRuleId: rewardRule.id
      }
    });

    competition = await prisma.competition.create({
      data: {
        title: 'Test Competition',
        slug: 'test-comp-' + Date.now(),
        description: 'A test competition',
        rules: 'Be fair',
        status: 'REGISTRATION_OPEN',
        capacity: 10,
        startAt: new Date(),
        submissionEndAt: new Date(Date.now() + 86400000)
      }
    });

    badge = await prisma.badge.create({
      data: {
        name: 'First Project',
        slug: 'first-project-' + Date.now(),
        description: 'Submit your first project',
        icon: '🏆',
        status: 'PUBLISHED',
        requirementType: 'PROJECT_SUBMITTED',
        requirementConfig: { threshold: 1 },
        rewardRuleId: rewardRule.id
      }
    });
  });

  // ===================== PROJECTS =====================

  describe('GET /api/projects', () => {
    it('should list published projects', async () => {
      const res = await request(app).get('/api/projects').set('Cookie', userACookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.projects).toBeDefined();
      expect(res.body.data.pagination).toBeDefined();
    });

    it('should reject unauthenticated', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return project detail', async () => {
      const res = await request(app).get(`/api/projects/${project.id}`).set('Cookie', userACookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.project.id).toBe(project.id);
    });

    it('should return 404 for invalid ID', async () => {
      const res = await request(app).get('/api/projects/000000000000000000000000').set('Cookie', userACookie);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/projects/:id/progress', () => {
    it('should start a project for User A', async () => {
      const res = await request(app)
        .patch(`/api/projects/${project.id}/progress`)
        .set('Cookie', userACookie)
        .send({ status: 'IN_PROGRESS' });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });
  });

  describe('POST /api/projects/:id/submissions', () => {
    it('should submit project for User A', async () => {
      const res = await request(app)
        .post(`/api/projects/${project.id}/submissions`)
        .set('Cookie', userACookie)
        .send({ repositoryUrl: 'https://github.com/test/repo' });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.status).toBe('SUBMITTED');
    });

    it('should reject duplicate submission', async () => {
      const res = await request(app)
        .post(`/api/projects/${project.id}/submissions`)
        .set('Cookie', userACookie)
        .send({ repositoryUrl: 'https://github.com/test/repo2' });
      expect(res.statusCode).toBe(409);
    });

    it('User B cannot see User A project submission in their detail', async () => {
      const res = await request(app).get(`/api/projects/${project.id}`).set('Cookie', userBCookie);
      expect(res.statusCode).toBe(200);
      // User B should see the project but NOT User A's submission
      expect(res.body.data.submission).toBeNull();
    });
  });

  // ===================== COMPETITIONS =====================

  describe('GET /api/competitions', () => {
    it('should list competitions', async () => {
      const res = await request(app).get('/api/competitions').set('Cookie', userACookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.competitions).toBeDefined();
    });

    it('should reject unauthenticated', async () => {
      const res = await request(app).get('/api/competitions');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/competitions/:id/register', () => {
    it('should register User A', async () => {
      const res = await request(app)
        .post(`/api/competitions/${competition.id}/register`)
        .set('Cookie', userACookie);
      expect(res.statusCode).toBe(201);
      expect(res.body.data.status).toBe('REGISTERED');
    });

    it('should reject duplicate registration', async () => {
      const res = await request(app)
        .post(`/api/competitions/${competition.id}/register`)
        .set('Cookie', userACookie);
      expect(res.statusCode).toBe(409);
    });
  });

  describe('DELETE /api/competitions/:id/register', () => {
    it('should cancel User A registration', async () => {
      const res = await request(app)
        .delete(`/api/competitions/${competition.id}/register`)
        .set('Cookie', userACookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('CANCELLED');
    });
  });

  describe('POST /api/competitions/:id/submissions', () => {
    it('should reject submission when competition is not active', async () => {
      const res = await request(app)
        .post(`/api/competitions/${competition.id}/submissions`)
        .set('Cookie', userBCookie)
        .send({ content: 'my entry' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error.code).toBe('NOT_ACTIVE');
    });
  });

  describe('GET /api/competitions/:id', () => {
    it('should return competition detail', async () => {
      const res = await request(app)
        .get(`/api/competitions/${competition.id}`)
        .set('Cookie', userACookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.competition.id).toBe(competition.id);
    });

    it('should return 404 for invalid ID', async () => {
      const res = await request(app)
        .get('/api/competitions/000000000000000000000000')
        .set('Cookie', userACookie);
      expect(res.statusCode).toBe(404);
    });
  });

  // ===================== BADGES =====================

  describe('GET /api/badges', () => {
    it('should return badges with earned status', async () => {
      const res = await request(app).get('/api/badges').set('Cookie', userACookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.badges).toBeDefined();
      expect(res.body.data.totalAvailable).toBeGreaterThan(0);
      // User A submitted a project, so the PROJECT_SUBMITTED badge should be earned
      expect(res.body.data.earned[badge.id]).toBeDefined();
    });

    it('should reject unauthenticated', async () => {
      const res = await request(app).get('/api/badges');
      expect(res.statusCode).toBe(401);
    });

    it('User B should NOT have User A earned badges', async () => {
      const res = await request(app).get('/api/badges').set('Cookie', userBCookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.earned[badge.id]).toBeUndefined();
    });
  });

  // ===================== POINTS =====================

  describe('GET /api/points', () => {
    it('User A should have points from project submission and badge', async () => {
      const res = await request(app).get('/api/points').set('Cookie', userACookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.balance).toBeGreaterThan(0);
      expect(res.body.data.transactions.length).toBeGreaterThan(0);
    });

    it('User B should have zero points', async () => {
      const res = await request(app).get('/api/points').set('Cookie', userBCookie);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.balance).toBe(0);
    });

    it('should reject unauthenticated', async () => {
      const res = await request(app).get('/api/points');
      expect(res.statusCode).toBe(401);
    });
  });

  // ===================== POINT IDEMPOTENCY =====================

  describe('Point Idempotency', () => {
    it('should not double-award points for the same project submission', async () => {
      const before = await request(app).get('/api/points').set('Cookie', userACookie);
      const beforeBalance = before.body.data.balance;

      // The reward was already processed when User A submitted the project.
      // Calling the reward service again should be idempotent.
      const { awardPoints } = require('../services/reward.service');
      const result = await awardPoints({
        userId: userAId,
        sourceType: 'PROJECT_SUBMITTED',
        sourceId: project.id,
        points: 100
      });
      expect(result).toBeNull(); // Already awarded

      const after = await request(app).get('/api/points').set('Cookie', userACookie);
      expect(after.body.data.balance).toBe(beforeBalance);
    });
  });

  // ===================== CROSS-USER SECURITY =====================

  describe('Cross-User Security', () => {
    it('User B cannot see User A point transactions', async () => {
      const res = await request(app).get('/api/points').set('Cookie', userBCookie);
      expect(res.body.data.transactions.length).toBe(0);
    });

    it('User B cannot see User A project progress', async () => {
      const res = await request(app).get(`/api/projects/${project.id}`).set('Cookie', userBCookie);
      expect(res.body.data.progress).toBeNull();
      expect(res.body.data.submission).toBeNull();
    });

    it('No POST /api/points endpoint exists (members cannot create points)', async () => {
      const res = await request(app)
        .post('/api/points')
        .set('Cookie', userACookie)
        .send({ amount: 9999, type: 'EARNED' });
      expect(res.statusCode).toBe(404);
    });

    it('No POST /api/badges endpoint exists (members cannot award badges)', async () => {
      const res = await request(app)
        .post('/api/badges')
        .set('Cookie', userACookie)
        .send({ badgeId: badge.id });
      expect(res.statusCode).toBe(404);
    });
  });
});
