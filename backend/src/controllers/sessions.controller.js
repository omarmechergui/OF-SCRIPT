const { getPrismaClient } = require('../config/prisma');
const { z } = require('zod');

const getSession = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        week: { include: { semester: true } },
        assignments: { where: { status: 'PUBLISHED' } }
      }
    });

    if (!session || session.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Session not found' }});
    }

    const progress = await prisma.sessionProgress.findUnique({
      where: {
        userId_sessionId: { userId, sessionId: id }
      }
    });

    res.status(200).json({
      success: true,
      data: { session, progress }
    });
  } catch (error) {
    console.error('Session Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' }});
  }
};

const updateProgressSchema = z.object({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
  progress: z.number().min(0).max(100).optional()
});

const updateProgress = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    // Validate body
    const result = updateProgressSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' }});
    }

    const { status, progress } = result.data;

    // Check if session exists
    const session = await prisma.session.findUnique({ where: { id }});
    if (!session || session.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Session not found' }});
    }

    const updateData = {
      status,
      progress: progress !== undefined ? progress : (status === 'COMPLETED' ? 100 : 0)
    };

    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }
    if (status === 'IN_PROGRESS') {
      updateData.startedAt = new Date();
    }

    const sessionProgress = await prisma.sessionProgress.upsert({
      where: {
        userId_sessionId: { userId, sessionId: id }
      },
      update: updateData,
      create: {
        userId,
        sessionId: id,
        ...updateData,
        startedAt: status === 'IN_PROGRESS' || status === 'COMPLETED' ? new Date() : null
      }
    });

    res.status(200).json({ success: true, data: sessionProgress });
  } catch (error) {
    console.error('Update Progress Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' }});
  }
};

module.exports = { getSession, updateProgress };
