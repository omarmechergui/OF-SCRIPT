const { getPrismaClient } = require('../../config/prisma');
const { z } = require('zod');
const { logAudit } = require('../../services/audit.service');
const { evaluateBadges } = require('../../services/reward.service');

const adjustPointsSchema = z.object({
  userId: z.string().length(24),
  amount: z.number().int(),
  reason: z.string().min(5)
});

const adjustPoints = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const result = adjustPointsSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload or missing reason' } });
    }

    const { userId, amount, reason } = result.data;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    }

    if (amount === 0) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_AMOUNT', message: 'Amount cannot be zero' } });
    }

    const type = amount > 0 ? 'ADJUSTMENT' : 'PENALTY'; // 'ADJUSTMENT' could mean positive or admin-created. We'll use absolute value and map to appropriate enum.
    
    // We'll record the amount as absolute, but point balance is calculated by subtracting penalties.
    // Wait, the transaction model schema does not enforce positive amounts, but semantically, type='EARNED' vs type='SPENT' or 'PENALTY'.
    // If it's an adjustment, we can just use ADJUSTMENT and a positive/negative amount.
    // Let's check getPoints logic: balance = EARNED - SPENT - PENALTY + ADJUSTMENT
    // So if we use ADJUSTMENT, a positive amount adds points, a negative amount removes them.

    const transaction = await prisma.pointTransaction.create({
      data: {
        userId,
        amount: amount,
        type: 'ADJUSTMENT',
        description: `Admin adjustment: ${reason}`,
        sourceType: 'ADMIN',
        sourceId: req.user.id
      }
    });

    await logAudit({
      userId: req.user.id,
      action: 'ADJUST_POINTS',
      entityType: 'User',
      entityId: userId,
      changes: { amount, reason, transactionId: transaction.id },
      ipAddress: req.ip
    });

    // Re-evaluate badges for the user since points changed
    await evaluateBadges(userId);

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    console.error('Admin Adjust Points Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { adjustPoints };
