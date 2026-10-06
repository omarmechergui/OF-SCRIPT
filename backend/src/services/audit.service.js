const { getPrismaClient } = require('../config/prisma');
const logger = require('../config/logger');

const logAudit = async ({ userId, action, entityType, entityId, changes, ipAddress, userAgent }) => {
  try {
    const prisma = getPrismaClient();
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        changes: changes ? changes : undefined,
        ipAddress,
        userAgent
      }
    });
  } catch (error) {
    logger.error('Failed to write audit log:', error);
  }
};

module.exports = { logAudit };
