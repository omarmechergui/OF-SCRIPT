const request = require('supertest');
const app = require('../app');
const { getPrismaClient } = require('../config/prisma');

describe('Member API', () => {
  let userCookie;
  let userId;
  let sessionData;
  let assignmentData;
  const prisma = getPrismaClient();

  beforeAll(async () => {
    // 1. Create a user
    const email = `member_${Date.now()}@test.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'member_test_' + Date.now(),
        email: email,
        password: 'Password123!',
        fullName: 'Member Test'
      });
    userCookie = res.headers['set-cookie'];
    const user = await prisma.user.findUnique({ where: { email: email }});
    userId = user.id;

    // 2. Create Roadmap Data
    const semester = await prisma.semester.create({
      data: { title: 'Semester 1', order: 1, status: 'PUBLISHED' }
    });

    const week = await prisma.week.create({
      data: { semesterId: semester.id, title: 'Week 1', order: 1, status: 'PUBLISHED' }
    });

    sessionData = await prisma.session.create({
      data: { weekId: week.id, title: 'Session 1', slug: 'session-1', order: 1, status: 'PUBLISHED' }
    });

    assignmentData = await prisma.assignment.create({
      data: { sessionId: sessionData.id, title: 'Assignment 1', slug: 'assign-1', status: 'PUBLISHED' }
    });
  });

  describe('GET /api/dashboard', () => {
    it('should return member dashboard', async () => {
      const res = await request(app)
        .get('/api/dashboard')
        .set('Cookie', userCookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe(userId);
      expect(res.body.data.progress).toBeDefined();
      expect(res.body.data.currentLearning).toBeDefined();
    });

    it('should fail without auth', async () => {
      const res = await request(app).get('/api/dashboard');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/roadmap', () => {
    it('should return roadmap structure', async () => {
      const res = await request(app)
        .get('/api/roadmap')
        .set('Cookie', userCookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.semesters).toBeDefined();
      expect(res.body.data.semesters.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/sessions/:id', () => {
    it('should return session details', async () => {
      const res = await request(app)
        .get(`/api/sessions/${sessionData.id}`)
        .set('Cookie', userCookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.session.id).toBe(sessionData.id);
    });
  });

  describe('PATCH /api/sessions/:id/progress', () => {
    it('should update progress', async () => {
      const res = await request(app)
        .patch(`/api/sessions/${sessionData.id}/progress`)
        .set('Cookie', userCookie)
        .send({ status: 'COMPLETED', progress: 100 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('COMPLETED');
    });
  });

  describe('GET /api/assignments', () => {
    it('should list assignments', async () => {
      const res = await request(app)
        .get('/api/assignments')
        .set('Cookie', userCookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.assignments).toBeDefined();
      const ids = res.body.data.assignments.map(a => a.id);
      expect(ids).toContain(assignmentData.id);
    });
  });

  describe('POST /api/assignments/:id/submissions', () => {
    it('should create an assignment submission', async () => {
      const res = await request(app)
        .post(`/api/assignments/${assignmentData.id}/submissions`)
        .set('Cookie', userCookie)
        .send({ content: 'My submission content' });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.status).toBe('SUBMITTED');
    });
  });

  describe('GET /api/assignments/:id', () => {
    it('should return assignment detail and submission', async () => {
      const res = await request(app)
        .get(`/api/assignments/${assignmentData.id}`)
        .set('Cookie', userCookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.assignment.id).toBe(assignmentData.id);
      expect(res.body.data.submission).toBeDefined();
      expect(res.body.data.submission.content).toBe('My submission content');
    });
  });
});
