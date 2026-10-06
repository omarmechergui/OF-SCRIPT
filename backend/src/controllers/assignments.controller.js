const { getPrismaClient } = require('../config/prisma');
const { z } = require('zod');

const getAssignments = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const userId = req.user.id;

    // Get all published assignments
    const assignmentsList = await prisma.assignment.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        session: { include: { week: { include: { semester: true } } } }
      }
    });

    const assignments = assignmentsList.sort((a, b) => {
      const semDiff = (a.session?.week?.semester?.order || 0) - (b.session?.week?.semester?.order || 0);
      if (semDiff !== 0) return semDiff;
      const weekDiff = (a.session?.week?.order || 0) - (b.session?.week?.order || 0);
      if (weekDiff !== 0) return weekDiff;
      return (a.session?.order || 0) - (b.session?.order || 0);
    });

    // Get user's submissions
    const submissions = await prisma.assignmentSubmission.findMany({
      where: { userId }
    });

    const submissionsMap = submissions.reduce((acc, curr) => {
      if (!acc[curr.assignmentId] || acc[curr.assignmentId].attemptNumber < curr.attemptNumber) {
        acc[curr.assignmentId] = curr;
      }
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        assignments,
        submissions: submissionsMap
      }
    });
  } catch (error) {
    console.error('Assignments Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' }});
  }
};

const getAssignment = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        session: { include: { week: { include: { semester: true } } } }
      }
    });

    if (!assignment || assignment.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Assignment not found' }});
    }

    // Get all submissions for this user to this assignment
    const submissions = await prisma.assignmentSubmission.findMany({
      where: { userId, assignmentId: id },
      orderBy: { attemptNumber: 'desc' }
    });

    const latestSubmission = submissions.length > 0 ? submissions[0] : null;

    res.status(200).json({
      success: true,
      data: {
        assignment,
        submission: latestSubmission,
        allSubmissions: submissions
      }
    });
  } catch (error) {
    console.error('Assignment Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' }});
  }
};

const submitSchema = z.object({
  content: z.string().min(1)
});

const submitAssignment = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;
    const userId = req.user.id;

    const result = submitSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' }});
    }

    const { content } = result.data;

    const assignment = await prisma.assignment.findUnique({ where: { id }});
    if (!assignment || assignment.status !== 'PUBLISHED') {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Assignment not found' }});
    }

    // Find latest submission to increment attempt
    const latestSubmission = await prisma.assignmentSubmission.findFirst({
      where: { userId, assignmentId: id },
      orderBy: { attemptNumber: 'desc' }
    });

    const attemptNumber = latestSubmission ? latestSubmission.attemptNumber + 1 : 1;

    if (assignment.maxAttempts && attemptNumber > assignment.maxAttempts) {
      return res.status(400).json({ success: false, error: { code: 'MAX_ATTEMPTS', message: 'Maximum attempts reached' }});
    }

    const newSubmission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId: id,
        userId,
        content,
        status: 'SUBMITTED',
        attemptNumber,
        submittedAt: new Date()
      }
    });

    res.status(201).json({ success: true, data: newSubmission });
  } catch (error) {
    console.error('Submit Assignment Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' }});
  }
};

module.exports = { getAssignments, getAssignment, submitAssignment };
