const { getPrismaClient } = require('../config/prisma');

const getPoints = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.pointTransaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.pointTransaction.count({ where: { userId } })
    ]);

    // Calculate totals
    const earned = await prisma.pointTransaction.aggregate({
      where: { userId, type: 'EARNED' },
      _sum: { amount: true }
    });
    const spent = await prisma.pointTransaction.aggregate({
      where: { userId, type: 'SPENT' },
      _sum: { amount: true }
    });
    const penalty = await prisma.pointTransaction.aggregate({
      where: { userId, type: 'PENALTY' },
      _sum: { amount: true }
    });
    const adjustment = await prisma.pointTransaction.aggregate({
      where: { userId, type: 'ADJUSTMENT' },
      _sum: { amount: true }
    });

    const balance = (earned._sum.amount || 0) - (spent._sum.amount || 0) - (penalty._sum.amount || 0) + (adjustment._sum.amount || 0);

    res.status(200).json({
      success: true,
      data: {
        balance,
        earned: earned._sum.amount || 0,
        spent: spent._sum.amount || 0,
        transactions,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    console.error('Points Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getPoints };
