const { getPrismaClient } = require('../../config/prisma');
const { z } = require('zod');
const { logAudit } = require('../../services/audit.service');

const getBadges = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const badges = await prisma.badge.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: { badges } });
  } catch (error) {
    console.error('Admin Get Badges Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const createBadgeSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  requirementType: z.enum(['POINTS_TOTAL', 'SESSIONS_COMPLETED', 'ASSIGNMENT_SCORE', 'PROJECT_SUBMITTED', 'COMPETITION_WIN', 'MANUAL']),
  requirementConfig: z.any().optional(), // Can be more strictly validated based on requirementType
  rewardRuleId: z.string().optional().nullable()
});

const createBadge = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const result = createBadgeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    const existing = await prisma.badge.findUnique({ where: { slug: result.data.slug } });
    if (existing) {
      return res.status(409).json({ success: false, error: { code: 'SLUG_EXISTS', message: 'Slug already in use' } });
    }

    const badge = await prisma.badge.create({ data: result.data });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_BADGE',
      entityType: 'Badge',
      entityId: badge.id,
      changes: result.data,
      ipAddress: req.ip
    });

    res.status(201).json({ success: true, data: badge });
  } catch (error) {
    console.error('Admin Create Badge Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const updateBadgeSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  requirementType: z.enum(['POINTS_TOTAL', 'SESSIONS_COMPLETED', 'ASSIGNMENT_SCORE', 'PROJECT_SUBMITTED', 'COMPETITION_WIN', 'MANUAL']).optional(),
  requirementConfig: z.any().optional(),
  rewardRuleId: z.string().optional().nullable()
});

const updateBadge = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;

    const result = updateBadgeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    if (result.data.slug) {
      const existing = await prisma.badge.findUnique({ where: { slug: result.data.slug } });
      if (existing && existing.id !== id) {
        return res.status(409).json({ success: false, error: { code: 'SLUG_EXISTS', message: 'Slug already in use' } });
      }
    }

    const badge = await prisma.badge.update({ where: { id }, data: result.data });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_BADGE',
      entityType: 'Badge',
      entityId: id,
      changes: result.data,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: badge });
  } catch (error) {
    console.error('Admin Update Badge Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getBadges, createBadge, updateBadge };
