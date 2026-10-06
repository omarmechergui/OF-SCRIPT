const { getPrismaClient } = require('../../config/prisma');

const getDashboardStats = async (req, res) => {
  try {
    const prisma = getPrismaClient();

    const [
      totalMembers,
      activeMembers,
      totalProjects,
      activeCompetitions,
      totalBadgesEarned,
      totalPointsDistributed
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'MEMBER' } }),
      prisma.user.count({ where: { role: 'MEMBER', status: 'ACTIVE' } }),
      prisma.project.count(),
      prisma.competition.count({ where: { status: 'ACTIVE' } }),
      prisma.userBadge.count(),
      prisma.pointTransaction.aggregate({
        where: { type: 'EARNED' },
        _sum: { amount: true }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        totalProjects,
        activeCompetitions,
        totalBadgesEarned,
        totalPointsDistributed: totalPointsDistributed._sum.amount || 0
      }
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getDashboardStats };
