import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;  // Need to keep 'var' here for global scope
}

const prismaClientSingleton = () => {
    const client = new PrismaClient({
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty',
    });

    client.$use(async (params, next) => {
      const start = performance.now();
      const result = await next(params);
      const end = performance.now();
      console.log(`${params.model}.${params.action} took ${end - start}ms`);
      return result;
    });

    return client;
};

export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}