const { getPrismaClient } = require('../../config/prisma');
const { z } = require('zod');
const { logAudit } = require('../../services/audit.service');

const getCompetitions = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [competitions, total] = await Promise.all([
      prisma.competition.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.competition.count()
    ]);

    res.status(200).json({
      success: true,
      data: { competitions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
    });
  } catch (error) {
    console.error('Admin Get Competitions Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const createCompetitionSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  rules: z.string().optional(),
  status: z.enum(['UPCOMING', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ACTIVE', 'ENDED']).optional(),
  capacity: z.number().positive().optional(),
  registrationStartAt: z.string().datetime().optional(),
  registrationEndAt: z.string().datetime().optional(),
  startAt: z.string().datetime().optional(),
  submissionEndAt: z.string().datetime().optional(),
});

const createCompetition = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const result = createCompetitionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    const data = { ...result.data };
    if (data.startAt && data.submissionEndAt && new Date(data.startAt) >= new Date(data.submissionEndAt)) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_DATES', message: 'Start date must be before end date' } });
    }

    const existing = await prisma.competition.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return res.status(409).json({ success: false, error: { code: 'SLUG_EXISTS', message: 'Slug already in use' } });
    }

    const competition = await prisma.competition.create({ data });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_COMPETITION',
      entityType: 'Competition',
      entityId: competition.id,
      changes: data,
      ipAddress: req.ip
    });

    res.status(201).json({ success: true, data: competition });
  } catch (error) {
    console.error('Admin Create Competition Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const updateCompetitionSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().optional(),
  rules: z.string().optional(),
  status: z.enum(['UPCOMING', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ACTIVE', 'ENDED']).optional(),
  capacity: z.number().positive().optional().nullable(),
  registrationStartAt: z.string().datetime().optional().nullable(),
  registrationEndAt: z.string().datetime().optional().nullable(),
  startAt: z.string().datetime().optional().nullable(),
  submissionEndAt: z.string().datetime().optional().nullable(),
});

const updateCompetition = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;

    const result = updateCompetitionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    if (result.data.slug) {
      const existing = await prisma.competition.findUnique({ where: { slug: result.data.slug } });
      if (existing && existing.id !== id) {
        return res.status(409).json({ success: false, error: { code: 'SLUG_EXISTS', message: 'Slug already in use' } });
      }
    }

    const competition = await prisma.competition.update({ where: { id }, data: result.data });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_COMPETITION',
      entityType: 'Competition',
      entityId: id,
      changes: result.data,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: competition });
  } catch (error) {
    console.error('Admin Update Competition Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const deleteCompetition = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;

    const [submissions, registrations] = await Promise.all([
      prisma.competitionSubmission.count({ where: { competitionId: id } }),
      prisma.competitionRegistration.count({ where: { competitionId: id } })
    ]);

    if (submissions > 0 || registrations > 0) {
      return res.status(400).json({ 
        success: false, 
        error: { code: 'HAS_DEPENDENCIES', message: 'Cannot delete competition with existing registrations or submissions.' } 
      });
    }

    await prisma.competition.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_COMPETITION',
      entityType: 'Competition',
      entityId: id,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, message: 'Competition deleted' });
  } catch (error) {
    console.error('Admin Delete Competition Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getCompetitions, createCompetition, updateCompetition, deleteCompetition };
