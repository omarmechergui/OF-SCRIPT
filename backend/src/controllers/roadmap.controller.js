const { getPrismaClient } = require('../config/prisma');

const getRoadmap = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const userId = req.user.id;

    // Get the full roadmap structure
    const semesters = await prisma.semester.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
      include: {
        weeks: {
          orderBy: { order: 'asc' },
          include: {
            sessions: {
              orderBy: { order: 'asc' },
              where: { status: 'PUBLISHED' },
              include: {
                assignments: {
                  where: { status: 'PUBLISHED' }
                }
              }
            }
          }
        }
      }
    });

    // Get user progress
    const sessionProgress = await prisma.sessionProgress.findMany({
      where: { userId }
    });
    
    const assignmentSubmissions = await prisma.assignmentSubmission.findMany({
      where: { userId }
    });

    // Create lookup maps for frontend convenience
    const progressMap = sessionProgress.reduce((acc, curr) => {
      acc[curr.sessionId] = curr;
      return acc;
    }, {});

    const submissionsMap = assignmentSubmissions.reduce((acc, curr) => {
      if (!acc[curr.assignmentId] || acc[curr.assignmentId].attemptNumber < curr.attemptNumber) {
        acc[curr.assignmentId] = curr; // keep latest attempt
      }
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        semesters,
        progress: progressMap,
        submissions: submissionsMap
      }
    });
  } catch (error) {
    console.error('Roadmap Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' }});
  }
};

module.exports = { getRoadmap };
