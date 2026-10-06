/**
 * Reward Service
 * 
 * Centralized service for awarding points and evaluating badge criteria.
 * All point mutations flow through this service to enforce idempotency
 * and consistent reward logic.
 */
const { getPrismaClient } = require('../config/prisma');

/**
 * Award points for a business event. Idempotent: will not double-award
 * for the same (userId, sourceType, sourceId) combination.
 * 
 * @param {Object} opts
 * @param {string} opts.userId
 * @param {string} opts.sourceType - e.g. 'SESSION_COMPLETED', 'ASSIGNMENT_SUBMITTED', 'PROJECT_SUBMITTED', 'COMPETITION_RESULT', 'BADGE_EARNED'
 * @param {string} opts.sourceId - the id of the source entity
 * @param {string} [opts.rewardRuleId] - optional RewardRule id to look up points
 * @param {number} [opts.points] - explicit points (used if no rewardRuleId)
 * @param {string} [opts.description]
 * @returns {Object|null} The created PointTransaction, or null if already awarded
 */
const awardPoints = async ({ userId, sourceType, sourceId, rewardRuleId, points, description }) => {
  const prisma = getPrismaClient();

  // Idempotency check: has this exact event already been rewarded?
  const existing = await prisma.pointTransaction.findFirst({
    where: { userId, sourceType, sourceId }
  });
  if (existing) return null; // Already awarded

  // Determine point amount
  let amount = points || 0;
  if (rewardRuleId) {
    const rule = await prisma.rewardRule.findUnique({ where: { id: rewardRuleId } });
    if (rule && rule.isActive) {
      amount = rule.points;
    }
  }

  if (amount <= 0) return null;

  const transaction = await prisma.pointTransaction.create({
    data: {
      userId,
      amount,
      type: 'EARNED',
      sourceType,
      sourceId,
      description: description || `${sourceType} reward`
    }
  });

  // After awarding points, evaluate badges
  await evaluateBadges(userId);

  return transaction;
};

/**
 * Evaluate all published badges for a user and award any that are newly earned.
 * Badge awarding is idempotent via the @@unique([userId, badgeId]) constraint.
 */
const evaluateBadges = async (userId) => {
  const prisma = getPrismaClient();

  const publishedBadges = await prisma.badge.findMany({
    where: { status: 'PUBLISHED' }
  });

  const earnedBadgeIds = (await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true }
  })).map(ub => ub.badgeId);

  for (const badge of publishedBadges) {
    if (earnedBadgeIds.includes(badge.id)) continue; // Already earned

    const met = await checkRequirement(userId, badge);
    if (met) {
      try {
        await prisma.userBadge.create({
          data: { userId, badgeId: badge.id, metadata: { autoAwarded: true } }
        });

        // If badge has a reward rule, award those points too
        if (badge.rewardRuleId) {
          await awardPoints({
            userId,
            sourceType: 'BADGE_EARNED',
            sourceId: badge.id,
            rewardRuleId: badge.rewardRuleId,
            description: `Badge earned: ${badge.name}`
          });
        }
      } catch (e) {
        // Unique constraint violation means it was already awarded (race condition safe)
        if (e.code !== 'P2002') throw e;
      }
    }
  }
};

/**
 * Check whether a user meets a badge's requirement.
 */
const checkRequirement = async (userId, badge) => {
  const prisma = getPrismaClient();
  const config = badge.requirementConfig || {};

  switch (badge.requirementType) {
    case 'POINTS_TOTAL': {
      const result = await prisma.pointTransaction.aggregate({
        where: { userId, type: 'EARNED' },
        _sum: { amount: true }
      });
      return (result._sum.amount || 0) >= (config.threshold || 0);
    }

    case 'SESSIONS_COMPLETED': {
      const count = await prisma.sessionProgress.count({
        where: { userId, status: 'COMPLETED' }
      });
      return count >= (config.threshold || 0);
    }

    case 'ASSIGNMENT_SCORE': {
      const submissions = await prisma.assignmentSubmission.findMany({
        where: { userId, status: 'APPROVED' }
      });
      if (config.minScore) {
        return submissions.some(s => (s.score || 0) >= config.minScore);
      }
      return submissions.length >= (config.threshold || 1);
    }

    case 'PROJECT_SUBMITTED': {
      const count = await prisma.projectSubmission.count({
        where: { userId, status: { in: ['SUBMITTED', 'APPROVED'] } }
      });
      return count >= (config.threshold || 1);
    }

    case 'COMPETITION_WIN': {
      const count = await prisma.competitionSubmission.count({
        where: { userId, status: 'APPROVED' }
      });
      return count >= (config.threshold || 1);
    }

    case 'MANUAL':
    default:
      return false; // Manual badges are awarded by admins only
  }
};

module.exports = { awardPoints, evaluateBadges };
