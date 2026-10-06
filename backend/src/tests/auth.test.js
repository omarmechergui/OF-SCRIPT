const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const { setUp, tearDown, clearDatabase } = require('./setup');
const { hashPassword, generateToken } = require('../utils/auth');
const { authenticate } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// app and prisma are loaded lazily after setUp sets DATABASE_URL
let app;
let prisma;

// Build a small Express app specifically for RBAC tests.
// The production app already has 404/error-handler middleware registered,
// so dynamically adding routes after boot never works.
const rbacApp = express();
rbacApp.use(express.json());
rbacApp.use(cookieParser());
rbacApp.get(
  '/api/test-admin',
  authenticate,
  requireRole('ADMIN'),
  (req, res) => res.json({ success: true })
);

beforeAll(async () => {
  await setUp();
  // Require app and prisma AFTER setUp has set DATABASE_URL
  app = require('../app');
  const { getPrismaClient } = require('../config/prisma');
  prisma = getPrismaClient();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await tearDown();
});

describe('Authentication API', () => {
  // ─── SANITY CHECK ───────────────────────────────────────────────
  describe('Test Environment Sanity Check', () => {
    it('should have a valid test environment and database connection', async () => {
      expect(process.env.NODE_ENV).toBe('test');
      expect(process.env.DATABASE_URL).toBeDefined();
      expect(process.env.DATABASE_URL).toContain('offscript_test');
      
      // Verify Prisma can connect and perform a basic operation
      const userCount = await prisma.user.count();
      expect(typeof userCount).toBe('number');
    });
  });

  // ─── REGISTRATION ───────────────────────────────────────────────
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123!',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.email).toBe('test@example.com');
      expect(res.body.data).not.toHaveProperty('passwordHash');
      expect(res.body.data).not.toHaveProperty('password');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/offscript_auth=/);
      expect(cookies[0]).toMatch(/HttpOnly/);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should prevent duplicate email registration', async () => {
      await prisma.user.create({
        data: {
          username: 'existing',
          email: 'test@example.com',
          passwordHash: 'hash',
        }
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'test@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toEqual(409);
      expect(res.body.error.code).toBe('ACCOUNT_EXISTS');
    });
  });

  // ─── LOGIN ──────────────────────────────────────────────────────
  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await prisma.user.create({
        data: {
          username: 'loginuser',
          email: 'login@example.com',
          passwordHash: await hashPassword('CorrectPass1!'),
        }
      });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'CorrectPass1!',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('login@example.com');

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/offscript_auth=/);
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword!',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
      // Error message must NOT leak whether the email or the password was wrong
      expect(res.body.error.message).not.toMatch(/password/i);
    });

    it('should fail with unknown account', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'Password123!',
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  // ─── ME (Auth Middleware) ───────────────────────────────────────
  describe('GET /api/auth/me', () => {
    let authCookie;

    beforeEach(async () => {
      await prisma.user.create({
        data: {
          username: 'meuser',
          email: 'me@example.com',
          passwordHash: await hashPassword('CorrectPass1!'),
          role: 'MEMBER'
        }
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'me@example.com', password: 'CorrectPass1!' });

      authCookie = res.headers['set-cookie'][0].split(';')[0];
    });

    it('should return current user with valid session', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', authCookie);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('meuser');
      expect(res.body.data).not.toHaveProperty('passwordHash');
    });

    it('should fail with missing authentication', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toEqual(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });

    it('should fail with expired JWT', async () => {
      const jwt = require('jsonwebtoken');
      const env = require('../config/env');

      // Create a token that expired 10 seconds ago
      const expiredJwt = jwt.sign(
        { sub: 'some-id', role: 'MEMBER' },
        env.jwtSecret,
        { expiresIn: '-10s' }
      );

      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', 'offscript_auth=' + expiredJwt);

      expect(res.statusCode).toEqual(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });

    it('should fail with malformed JWT', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', 'offscript_auth=not.a.valid.jwt.token');

      expect(res.statusCode).toEqual(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });
  });

  // ─── LOGOUT ─────────────────────────────────────────────────────
  describe('POST /api/auth/logout', () => {
    it('should clear authentication cookie and revoke access', async () => {
      // 1. Create user and login
      await prisma.user.create({
        data: {
          username: 'logoutuser',
          email: 'logout@example.com',
          passwordHash: await hashPassword('Password1!'),
        }
      });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'logout@example.com', password: 'Password1!' });
      expect(loginRes.statusCode).toEqual(200);

      const sessionCookie = loginRes.headers['set-cookie'][0].split(';')[0];

      // 2. Confirm /me works while logged in
      const meRes = await request(app)
        .get('/api/auth/me')
        .set('Cookie', sessionCookie);
      expect(meRes.statusCode).toEqual(200);

      // 3. Logout
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', sessionCookie);
      expect(logoutRes.statusCode).toEqual(200);

      const logoutCookies = logoutRes.headers['set-cookie'];
      expect(logoutCookies).toBeDefined();
      expect(logoutCookies[0]).toMatch(/offscript_auth=;/);
      expect(logoutCookies[0]).toMatch(/Max-Age=0/);

      // 4. Confirm /me is now unauthenticated (no cookie sent)
      const afterLogoutRes = await request(app).get('/api/auth/me');
      expect(afterLogoutRes.statusCode).toEqual(401);
    });
  });

  // ─── RESET PASSWORD ─────────────────────────────────────────────
  describe('POST /api/auth/reset-password', () => {
    let validToken;
    let expiredToken;
    let resetUser;

    beforeEach(async () => {
      resetUser = await prisma.user.create({
        data: {
          username: 'resetuser',
          email: 'reset@example.com',
          passwordHash: await hashPassword('OldPassword1!'),
          status: 'ACTIVE'
        }
      });

      const crypto = require('crypto');
      const token1 = crypto.randomBytes(32).toString('hex');
      const hash1 = crypto.createHash('sha256').update(token1).digest('hex');

      const token2 = crypto.randomBytes(32).toString('hex');
      const hash2 = crypto.createHash('sha256').update(token2).digest('hex');

      // Access the exported in-memory store
      const { resetTokens } = require('../controllers/auth.controller');
      resetTokens.set(hash1, { userId: resetUser.id, expires: Date.now() + 15 * 60 * 1000 });
      resetTokens.set(hash2, { userId: resetUser.id, expires: Date.now() - 1000 }); // Expired

      validToken = token1;
      expiredToken = token2;
    });

    it('should reset password with valid token and re-hash using Argon2id', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: validToken, newPassword: 'NewPassword2!' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);

      const updatedUser = await prisma.user.findUnique({ where: { id: resetUser.id } });
      expect(updatedUser.passwordHash).not.toBe(resetUser.passwordHash);
      expect(updatedUser.passwordHash).toMatch(/^\$argon2/); // Ensures Argon2id is used

      // Token is cleared / cannot be reused
      const reuseRes = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: validToken, newPassword: 'AnotherPassword3!' });
      expect(reuseRes.statusCode).toEqual(400);

      // Old password no longer works
      const oldLoginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'reset@example.com', password: 'OldPassword1!' });
      expect(oldLoginRes.statusCode).toEqual(401);

      // New password works
      const newLoginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'reset@example.com', password: 'NewPassword2!' });
      expect(newLoginRes.statusCode).toEqual(200);
    });

    it('should fail with invalid reset token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'invalid-token-string', newPassword: 'NewPassword2!' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });

    it('should fail with expired reset token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: expiredToken, newPassword: 'NewPassword2!' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error.code).toBe('INVALID_TOKEN');
    });

    it('should fail with missing token', async () => {
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ newPassword: 'NewPassword2!' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // ─── FORGOT PASSWORD ───────────────────────────────────────────
  describe('POST /api/auth/forgot-password', () => {
    it('should return success even for unknown email (prevent enumeration)', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'unknown@example.com' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.message).toMatch(/password reset email has been sent/);
    });
  });

  // ─── RBAC MIDDLEWARE ────────────────────────────────────────────
  // Uses a dedicated mini Express app (rbacApp) so the test route
  // is registered *before* any catch-all 404 handler.
  describe('RBAC Middleware', () => {
    let memberCookie, adminCookie;

    beforeEach(async () => {
      const member = await prisma.user.create({
        data: { username: 'rbacmember', email: 'member@test.com', passwordHash: 'hash', role: 'MEMBER' }
      });
      const admin = await prisma.user.create({
        data: { username: 'rbacadmin', email: 'admin@test.com', passwordHash: 'hash', role: 'ADMIN' }
      });

      const mToken = generateToken({ sub: member.id, role: member.role });
      const aToken = generateToken({ sub: admin.id, role: admin.role });

      memberCookie = 'offscript_auth=' + mToken;
      adminCookie = 'offscript_auth=' + aToken;
    });

    it('authenticated + allowed role -> PASS', async () => {
      const res = await request(rbacApp).get('/api/test-admin').set('Cookie', adminCookie);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });

    it('authenticated + wrong role -> DENY', async () => {
      const res = await request(rbacApp).get('/api/test-admin').set('Cookie', memberCookie);
      expect(res.statusCode).toEqual(403);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('unauthenticated -> DENY', async () => {
      const res = await request(rbacApp).get('/api/test-admin');
      expect(res.statusCode).toEqual(401);
      expect(res.body.error.code).toBe('UNAUTHENTICATED');
    });
  });
});
