const { getPrismaClient } = require('../../config/prisma');

const getAuditLogs = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { username: true, role: true } }
        }
      }),
      prisma.auditLog.count()
    ]);

    res.status(200).json({
      success: true,
      data: { logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
    });
  } catch (error) {
    console.error('Admin Get Audit Logs Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getAuditLogs };
