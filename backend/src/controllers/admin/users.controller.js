const { getPrismaClient } = require('../../config/prisma');
const { z } = require('zod');
const { logAudit } = require('../../services/audit.service');

const getUsers = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true, username: true, email: true, role: true, status: true,
          fullName: true, createdAt: true, lastLoginAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count()
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error('Admin Get Users Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const getUser = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, username: true, email: true, role: true, status: true,
        fullName: true, bio: true, emailVerified: true, createdAt: true, lastLoginAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    const [pointsAggr, badgesCount, projectsCount] = await Promise.all([
      prisma.pointTransaction.aggregate({ where: { userId: id, type: 'EARNED' }, _sum: { amount: true } }),
      prisma.userBadge.count({ where: { userId: id } }),
      prisma.projectSubmission.count({ where: { userId: id } })
    ]);

    const points = pointsAggr._sum.amount || 0;

    res.status(200).json({
      success: true,
      data: { user, stats: { points, badgesCount, projectsCount } }
    });
  } catch (error) {
    console.error('Admin Get User Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const updateUserSchema = z.object({
  role: z.enum(['MEMBER', 'ADMIN']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION']).optional(),
  fullName: z.string().max(100).optional(),
});

const updateUser = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    
    if (id === req.user.id && req.body.role && req.body.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Cannot demote yourself' } });
    }

    if (id === req.user.id && req.body.status && req.body.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Cannot deactivate yourself' } });
    }

    const result = updateUserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    // Check if this is the last admin
    if (existingUser.role === 'ADMIN' && (result.data.role === 'MEMBER' || (result.data.status && result.data.status !== 'ACTIVE'))) {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN', status: 'ACTIVE' } });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, error: { code: 'LAST_ADMIN', message: 'Cannot demote or deactivate the last active admin' } });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: result.data,
      select: { id: true, username: true, email: true, role: true, status: true, fullName: true }
    });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_USER',
      entityType: 'User',
      entityId: id,
      changes: result.data,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Admin Update User Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getUsers, getUser, updateUser };
