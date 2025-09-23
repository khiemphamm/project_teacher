import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
export const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

// Database connection helper
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Database disconnection helper
export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw error;
  }
}