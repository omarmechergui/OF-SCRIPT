const { getPrismaClient } = require('../config/prisma');
const { z } = require('zod');
const { awardPoints } = require('../services/reward.service');

const getProjects = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.project.count({ where: { status: 'PUBLISHED' } })
    ]);

    // Get user progress for these projects
    const projectIds = projects.map(p => p.id);
    const progressRecords = await prisma.projectProgress.findMany({
      where: { userId, projectId: { in: projectIds } }
    });
    const progressMap = progressRecords.reduce((acc, p) => {
      acc[p.projectId] = p;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        projects,
        progress: progressMap,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error('Projects Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const getProject = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }

    const progress = await prisma.projectProgress.findUnique({
      where: { userId_projectId: { userId, projectId: id } }
    });

    const submission = await prisma.projectSubmission.findUnique({
      where: { userId_projectId: { userId, projectId: id } }
    });

    res.status(200).json({
      success: true,
      data: { project, progress, submission }
    });
  } catch (error) {
    console.error('Project Detail Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const startProjectSchema = z.object({
  status: z.enum(['IN_PROGRESS'])
});

const startProject = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    const result = startProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }

    const progress = await prisma.projectProgress.upsert({
      where: { userId_projectId: { userId, projectId: id } },
      update: { status: 'IN_PROGRESS', startedAt: new Date() },
      create: { userId, projectId: id, status: 'IN_PROGRESS', startedAt: new Date() }
    });

    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    console.error('Start Project Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const submitProjectSchema = z.object({
  content: z.string().optional(),
  repositoryUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional()
}).refine(data => data.content || data.repositoryUrl, {
  message: 'Either content or repositoryUrl is required'
});

const submitProject = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    const result = submitProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: result.error.issues[0]?.message || 'Invalid payload' } });
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }

    if (project.deadline && new Date() > new Date(project.deadline)) {
      return res.status(400).json({ success: false, error: { code: 'DEADLINE_PASSED', message: 'Project submission deadline has passed' } });
    }

    // Check if already submitted
    const existing = await prisma.projectSubmission.findUnique({
      where: { userId_projectId: { userId, projectId: id } }
    });
    if (existing) {
      return res.status(409).json({ success: false, error: { code: 'ALREADY_SUBMITTED', message: 'Project already submitted' } });
    }

    const { content, repositoryUrl, demoUrl } = result.data;

    const submission = await prisma.projectSubmission.create({
      data: {
        projectId: id,
        userId,
        content,
        repositoryUrl,
        demoUrl,
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    });

    // Mark progress as completed
    await prisma.projectProgress.upsert({
      where: { userId_projectId: { userId, projectId: id } },
      update: { status: 'COMPLETED', progress: 100, completedAt: new Date() },
      create: { userId, projectId: id, status: 'COMPLETED', progress: 100, startedAt: new Date(), completedAt: new Date() }
    });

    // Award points
    await awardPoints({
      userId,
      sourceType: 'PROJECT_SUBMITTED',
      sourceId: id,
      rewardRuleId: project.rewardRuleId || undefined,
      points: project.rewardRuleId ? undefined : 50,
      description: `Project submitted: ${project.title}`
    });

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    console.error('Submit Project Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getProjects, getProject, startProject, submitProject };
