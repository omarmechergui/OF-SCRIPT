const { getPrismaClient } = require('../config/prisma');
const { hashPassword, verifyPassword, generateToken } = require('../utils/auth');
const env = require('../config/env');
const crypto = require('crypto');
const logger = require('../config/logger');

const prisma = () => getPrismaClient();
const COOKIE_NAME = 'offscript_auth';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'lax' : 'lax', // Use 'none' if cross-domain in prod
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  const email = req.body.email?.toLowerCase();

  try {
    const existingUser = await prisma().user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'ACCOUNT_EXISTS', message: 'Email or username already in use' },
      });
    }

    const passwordHash = await hashPassword(password);
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || null;

    const user = await prisma().user.create({
      data: {
        username,
        email,
        passwordHash,
        fullName,
      },
    });

    const token = generateToken({ sub: user.id, role: user.role });
    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const login = async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.toLowerCase();

  try {
    const user = await prisma().user.findUnique({ where: { email } });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
      });
    }

    const isValid = await verifyPassword(user.passwordHash, password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
      });
    }

    await prisma().user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateToken({ sub: user.id, role: user.role });
    res.cookie(COOKIE_NAME, token, cookieOptions);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
  res.status(200).json({ success: true, data: { message: 'Logged out successfully' } });
};

const getMe = async (req, res) => {
  try {
    const user = await prisma().user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

// In-memory store for reset tokens for simplicity, ideally use Redis or DB
const resetTokens = new Map();

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await prisma().user.findUnique({ where: { email } });
    if (user && user.status === 'ACTIVE') {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hash = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      resetTokens.set(hash, { userId: user.id, expires: Date.now() + 15 * 60 * 1000 }); // 15 mins
      
      // Send email logic would go here
      logger.info(`Password reset requested for ${email}.`);
    }

    // Always return same response
    res.status(200).json({
      success: true,
      data: { message: 'If the account exists, a password reset email has been sent.' }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const resetData = resetTokens.get(hash);

    if (!resetData || resetData.expires < Date.now()) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid or expired reset token' }
      });
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma().user.update({
      where: { id: resetData.userId },
      data: { passwordHash, passwordChangedAt: new Date() },
    });

    resetTokens.delete(hash); // Invalidate token

    res.status(200).json({ success: true, data: { message: 'Password reset successful' } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  resetTokens,
};
