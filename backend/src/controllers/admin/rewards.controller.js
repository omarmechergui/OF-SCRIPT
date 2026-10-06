const { getPrismaClient } = require('../../config/prisma');
const { z } = require('zod');
const { logAudit } = require('../../services/audit.service');

const getRewardRules = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const rules = await prisma.rewardRule.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, data: { rules } });
  } catch (error) {
    console.error('Admin Get Rewards Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const createRewardRuleSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  points: z.number().int().positive(),
  isActive: z.boolean().optional()
});

const createRewardRule = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const result = createRewardRuleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    const rule = await prisma.rewardRule.create({ data: result.data });

    await logAudit({
      userId: req.user.id,
      action: 'CREATE_REWARD_RULE',
      entityType: 'RewardRule',
      entityId: rule.id,
      changes: result.data,
      ipAddress: req.ip
    });

    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    console.error('Admin Create Reward Rule Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

const updateRewardRuleSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  points: z.number().int().positive().optional(),
  isActive: z.boolean().optional()
});

const updateRewardRule = async (req, res) => {
  try {
    const prisma = getPrismaClient();
    const { id } = req.params;

    const result = updateRewardRuleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' } });
    }

    const rule = await prisma.rewardRule.update({ where: { id }, data: result.data });

    await logAudit({
      userId: req.user.id,
      action: 'UPDATE_REWARD_RULE',
      entityType: 'RewardRule',
      entityId: id,
      changes: result.data,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, data: rule });
  } catch (error) {
    console.error('Admin Update Reward Rule Error:', error);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } });
  }
};

module.exports = { getRewardRules, createRewardRule, updateRewardRule };
