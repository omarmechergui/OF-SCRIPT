const { getPrismaClient } = require('../../config/prisma');
const { z } = require('zod');
const { logAudit } = require('../../services/audit.service');

const getProjects = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.project.count()
    ]);

    res.status(200).json({
      success: true,
      data: { projects, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
    });
  } catch (error) {
    console.error('Admin Get Projects Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const createProjectSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  requirements: z.string().optional(),
  difficulty: z.number().min(1).max(10).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  technologies: z.array(z.string()).optional()
});

const createProject = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const result = createProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    const existing = await prisma.project.findUnique({ where: { slug: result.data.slug } });
    if (existing) {
      return res.status(409).json({ success: false, error: { code: 'SLUG_EXISTS', message: 'Slug already in use' } });
    }

    const project = await prisma.project.create({ data: result.data });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_PROJECT',
      entityType: 'Project',
      entityId: project.id,
      changes: result.data,
      ipAddress: req.ip
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Admin Create Project Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const updateProjectSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().optional(),
  requirements: z.string().optional(),
  difficulty: z.number().min(1).max(10).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  technologies: z.array(z.string()).optional()
});

const updateProject = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;

    const result = updateProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    if (result.data.slug) {
      const existing = await prisma.project.findUnique({ where: { slug: result.data.slug } });
      if (existing && existing.id !== id) {
        return res.status(409).json({ success: false, error: { code: 'SLUG_EXISTS', message: 'Slug already in use' } });
      }
    }

    const project = await prisma.project.update({ where: { id }, data: result.data });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_PROJECT',
      entityType: 'Project',
      entityId: id,
      changes: result.data,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error('Admin Update Project Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const deleteProject = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;

    const [submissions, progress] = await Promise.all([
      prisma.projectSubmission.count({ where: { projectId: id } }),
      prisma.projectProgress.count({ where: { projectId: id } })
    ]);

    if (submissions > 0 || progress > 0) {
      return res.status(400).json({ 
        success: false, 
        error: { code: 'HAS_DEPENDENCIES', message: 'Cannot delete project with existing submissions or member progress. Archive it instead.' } 
      });
    }

    await prisma.project.delete({ where: { id } });

    await logAudit({
      userId: req.user.id,
      action: 'DELETE_PROJECT',
      entityType: 'Project',
      entityId: id,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Admin Delete Project Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
