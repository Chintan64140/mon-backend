process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// import { PrismaClient } from "@prisma/client";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
