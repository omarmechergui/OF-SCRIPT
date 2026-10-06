const { MongoMemoryReplSet } = require('mongodb-memory-server');
const { resetPrismaClient, getPrismaClient } = require('../config/prisma');

let mongod;

module.exports = {
  setUp: async () => {
    mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const baseUri = mongod.getUri();
    const uri = baseUri.replace('?', 'offscript_test?');

    // Set DATABASE_URL BEFORE any PrismaClient is created
    process.env.DATABASE_URL = uri;

    // Reset any previously-cached singleton so it picks up the new URL
    resetPrismaClient();

    // Force-connect so Prisma's lazy connect doesn't surprise us later
    await getPrismaClient().$connect();
  },

  tearDown: async () => {
    try {
      // Disconnect the singleton
      resetPrismaClient();
    } catch (_) { /* ignore */ }
    if (mongod) {
      await mongod.stop();
      mongod = null;
    }
  },

  clearDatabase: async () => {
    const prisma = getPrismaClient();
    try {
      const result = await prisma.$runCommandRaw({ listCollections: 1 });
      for (const collection of result.cursor.firstBatch) {
        if (collection.name !== '_prisma_migrations') {
          await prisma.$runCommandRaw({
            delete: collection.name,
            deletes: [{ q: {}, limit: 0 }]
          });
        }
      }
    } catch (e) {
      // Collection might not exist yet, ignore
    }
  },

  getPrisma: () => getPrismaClient(),
};
