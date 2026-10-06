const { verifyToken } = require('../utils/auth');
const { getPrismaClient } = require('../config/prisma');
const logger = require('../config/logger');


const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.offscript_auth;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHENTICATED', message: 'Authentication required' }
      });
    }

    const decoded = verifyToken(token);
    
    // Quick DB check to ensure user isn't suspended (optional based on rules, but recommended)
    const user = await getPrismaClient().user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, role: true, status: true }
    });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHENTICATED', message: 'Invalid or inactive account' }
      });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    logger.error('Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHENTICATED', message: 'Invalid or expired token' }
    });
  }
};

module.exports = { authenticate };
