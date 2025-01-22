import { PrismaClient } from "@prisma/client";

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;  // Need to keep 'var' here for global scope
}

const prismaClientSingleton = () => {
    return new PrismaClient({
      log: ['query', 'error', 'warn'],
      errorFormat: 'pretty',
    }).$extends({
      query: {
        async $allOperations({ operation, model, args, query }) {
          const start = performance.now();
          const result = await query(args);
          const end = performance.now();
          
          console.log(`${model}.${operation} took ${end - start}ms`);
          return result;
        },
      },
    });
  };


export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db as PrismaClient;
}