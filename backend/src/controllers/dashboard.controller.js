const { getPrismaClient } = require('../config/prisma');

const getDashboard = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const userId = req.user.id;

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, fullName: true, avatar: true }
    });

    // Get all published sessions count
    const totalSessions = await prisma.session.count({
      where: { status: 'PUBLISHED' }
    });

    // Get user's completed sessions
    const completedSessionsCount = await prisma.sessionProgress.count({
      where: { userId, status: 'COMPLETED' }
    });

    const progressPercentage = totalSessions === 0 ? 0 : Math.round((completedSessionsCount / totalSessions) * 100);

    // Find the next session the user needs to do (first published session not completed)
    // We can find the highest order completed session, and get the next one.
    // Or just get all user progress and find the next session by order.
    // Let's get the most recently started/completed progress
    const recentProgress = await prisma.sessionProgress.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        session: {
          include: { week: { include: { semester: true } } }
        }
      }
    });

    let currentLearning = null;
    if (recentProgress && recentProgress.status !== 'COMPLETED') {
       currentLearning = recentProgress.session;
    } else {
       // Find the first session that has NO progress or is NOT_STARTED
       const allProgress = await prisma.sessionProgress.findMany({ where: { userId }});
       const progressSessionIds = allProgress.map(p => p.sessionId);
       
       currentLearning = await prisma.session.findFirst({
         where: { 
           status: 'PUBLISHED',
           id: { notIn: progressSessionIds }
         },
         orderBy: [
           { week: { semester: { order: 'asc' } } },
           { week: { order: 'asc' } },
           { order: 'asc' }
         ],
         include: { week: { include: { semester: true } } }
       });
    }

    // Recent activity (latest 5 completed sessions or submitted assignments)
    const recentSessions = await prisma.sessionProgress.findMany({
      where: { userId, status: 'COMPLETED' },
      orderBy: { completedAt: 'desc' },
      take: 3,
      include: { session: true }
    });

    const recentAssignments = await prisma.assignmentSubmission.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
      take: 3,
      include: { assignment: true }
    });

    // Combine and sort
    let recentActivity = [
      ...recentSessions.map(s => ({ type: 'SESSION', title: s.session.title, date: s.completedAt, id: s.id })),
      ...recentAssignments.map(a => ({ type: 'ASSIGNMENT', title: a.assignment.title, date: a.submittedAt, id: a.id }))
    ].sort((a, b) => b.date - a.date).slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        user,
        progress: {
          percentage: progressPercentage,
          completedSessions: completedSessionsCount,
          totalSessions
        },
        currentLearning,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' }});
  }
};

module.exports = { getDashboard };
