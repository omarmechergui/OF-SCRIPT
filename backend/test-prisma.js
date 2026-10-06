const { MongoMemoryReplSet } = require('mongodb-memory-server');
const { PrismaClient } = require('@prisma/client');

async function run() {
  console.log("Starting mongod...");
  const mongod = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const uri = mongod.getUri().replace('?', 'offscript_test?');
  console.log("Mongo URI:", uri);
  
  const prisma = new PrismaClient({ datasources: { db: { url: uri } } });
  console.log("Connecting prisma...");
  await prisma.$connect();
  console.log("Prisma connected!");
  
  console.log("Creating user...");
  try {
    const user = await prisma.user.create({
      data: {
        username: 'test',
        email: 'test@example.com',
        passwordHash: 'hash',
        role: 'MEMBER'
      }
    });
    console.log("User created:", user);
  } catch (err) {
    console.error("Error:", err);
  }
  
  await prisma.$disconnect();
  await mongod.stop();
}

run().catch(console.error);
