const { PrismaClient } = require('@prisma/client');

/** Lazy singleton – the PrismaClient is created on first access,
 *  so tests can override process.env.DATABASE_URL before any import
 *  triggers instantiation. */
let prisma;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
  }
  return prisma;
}

/** Allow tests to replace the singleton after MongoMemoryServer sets DATABASE_URL. */
function resetPrismaClient() {
  if (prisma) {
    prisma.$disconnect().catch(() => {});
  }
  prisma = null;
}

module.exports = { getPrismaClient, resetPrismaClient };
