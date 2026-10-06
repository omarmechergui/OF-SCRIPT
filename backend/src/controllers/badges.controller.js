const { getPrismaClient } = require('../config/prisma');

const getBadges = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const userId = req.user.id;

    const badges = await prisma.badge.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'asc' }
    });

    const earnedBadges = await prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true, earnedAt: true }
    });

    const earnedMap = earnedBadges.reduce((acc, ub) => {
      acc[ub.badgeId] = { earned: true, earnedAt: ub.earnedAt };
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        badges,
        earned: earnedMap,
        totalEarned: earnedBadges.length,
        totalAvailable: badges.length
      }
    });
  } catch (error) {
    console.error('Badges Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getBadges };
