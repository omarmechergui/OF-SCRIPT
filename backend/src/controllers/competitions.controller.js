const { getPrismaClient } = require('../config/prisma');
const { z } = require('zod');

const getCompetitions = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const skip = (page - 1) * limit;

    const [competitions, total] = await Promise.all([
      prisma.competition.findMany({
        where: { status: { not: 'UPCOMING' } },
        orderBy: { startAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.competition.count({ where: { status: { not: 'UPCOMING' } } })
    ]);

    // Get user registrations for these
    const compIds = competitions.map(c => c.id);
    const registrations = await prisma.competitionRegistration.findMany({
      where: { userId, competitionId: { in: compIds } }
    });
    const registrationMap = registrations.reduce((acc, r) => {
      acc[r.competitionId] = r;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        competitions,
        registrations: registrationMap,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error('Competitions Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const getCompetition = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    const competition = await prisma.competition.findUnique({ where: { id } });
    if (!competition || competition.status === 'UPCOMING') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Competition not found' } });
    }

    const registration = await prisma.competitionRegistration.findUnique({
      where: { userId_competitionId: { userId, competitionId: id } }
    });

    const submission = await prisma.competitionSubmission.findUnique({
      where: { userId_competitionId: { userId, competitionId: id } }
    });

    res.status(200).json({
      success: true,
      data: { competition, registration, submission }
    });
  } catch (error) {
    console.error('Competition Detail Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const registerForCompetition = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    const competition = await prisma.competition.findUnique({ where: { id } });
    if (!competition) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Competition not found' } });
    }

    if (competition.status !== 'REGISTRATION_OPEN') {
      return res.status(400).json({ success: false, error: { code: 'REGISTRATION_CLOSED', message: 'Registration is not currently open' } });
    }

    // Check capacity
    if (competition.capacity) {
      const count = await prisma.competitionRegistration.count({
        where: { competitionId: id, status: 'REGISTERED' }
      });
      if (count >= competition.capacity) {
        return res.status(400).json({ success: false, error: { code: 'CAPACITY_FULL', message: 'Competition is at full capacity' } });
      }
    }

    // Check existing registration
    const existing = await prisma.competitionRegistration.findUnique({
      where: { userId_competitionId: { userId, competitionId: id } }
    });
    if (existing && existing.status === 'REGISTERED') {
      return res.status(409).json({ success: false, error: { code: 'ALREADY_REGISTERED', message: 'Already registered' } });
    }

    const registration = await prisma.competitionRegistration.upsert({
      where: { userId_competitionId: { userId, competitionId: id } },
      update: { status: 'REGISTERED', registeredAt: new Date() },
      create: { userId, competitionId: id, status: 'REGISTERED' }
    });

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    console.error('Register Competition Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    const registration = await prisma.competitionRegistration.findUnique({
      where: { userId_competitionId: { userId, competitionId: id } }
    });

    if (!registration || registration.status !== 'REGISTERED') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'No active registration found' } });
    }

    const competition = await prisma.competition.findUnique({ where: { id } });
    if (competition && competition.status === 'ACTIVE') {
      return res.status(400).json({ success: false, error: { code: 'COMPETITION_ACTIVE', message: 'Cannot cancel registration for an active competition' } });
    }

    const updated = await prisma.competitionRegistration.update({
      where: { userId_competitionId: { userId, competitionId: id } },
      data: { status: 'CANCELLED' }
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Cancel Registration Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const submitCompetitionSchema = z.object({
  content: z.string().optional(),
  repositoryUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional()
}).refine(data => data.content || data.repositoryUrl, {
  message: 'Either content or repositoryUrl is required'
});

const submitCompetitionEntry = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    const result = submitCompetitionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: result.error.issues[0]?.message || 'Invalid payload' } });
    }

    const competition = await prisma.competition.findUnique({ where: { id } });
    if (!competition) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Competition not found' } });
    }
    if (competition.status !== 'ACTIVE') {
      return res.status(400).json({ success: false, error: { code: 'NOT_ACTIVE', message: 'Competition is not currently active' } });
    }

    // Must be registered
    const registration = await prisma.competitionRegistration.findUnique({
      where: { userId_competitionId: { userId, competitionId: id } }
    });
    if (!registration || registration.status !== 'REGISTERED') {
      return res.status(403).json({ success: false, error: { code: 'NOT_REGISTERED', message: 'You must be registered to submit' } });
    }

    // Check existing submission
    const existing = await prisma.competitionSubmission.findUnique({
      where: { userId_competitionId: { userId, competitionId: id } }
    });
    if (existing) {
      return res.status(409).json({ success: false, error: { code: 'ALREADY_SUBMITTED', message: 'Submission already exists' } });
    }

    const { content, repositoryUrl, demoUrl } = result.data;

    const submission = await prisma.competitionSubmission.create({
      data: {
        userId,
        competitionId: id,
        content,
        repositoryUrl,
        demoUrl,
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    console.error('Submit Competition Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getCompetitions, getCompetition, registerForCompetition, cancelRegistration, submitCompetitionEntry };
