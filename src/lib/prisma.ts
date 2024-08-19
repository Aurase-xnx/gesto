import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development (hot reloading can lead to multiple instances of Prisma Client)
export const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}