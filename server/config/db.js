import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const globalForPrisma = globalThis;
export const basePrisma = globalForPrisma.prismaBase || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaBase = basePrisma;
}

// Helper to determine if a model has updatedAt
const modelsWithoutUpdatedAt = ["Message", "SearchQuery", "PaymentRecord"];

// Helper to get current time in IST (UTC + 5:30) for database storage
function getISTDate() {
  return new Date();
}

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async create({ model, args, query }) {
        if (args.data) {
          const istNow = getISTDate();
          args.data.createdAt = istNow;
          if (!modelsWithoutUpdatedAt.includes(model)) {
            args.data.updatedAt = istNow;
          }
        }
        return query(args);
      },
      async update({ model, args, query }) {
        if (args.data && !modelsWithoutUpdatedAt.includes(model)) {
          args.data.updatedAt = getISTDate();
        }
        return query(args);
      },
      async upsert({ model, args, query }) {
        const istNow = getISTDate();
        if (args.create) {
          args.create.createdAt = istNow;
          if (!modelsWithoutUpdatedAt.includes(model)) {
            args.create.updatedAt = istNow;
          }
        }
        if (args.update && !modelsWithoutUpdatedAt.includes(model)) {
          args.update.updatedAt = istNow;
        }
        return query(args);
      },
      async createMany({ model, args, query }) {
        if (Array.isArray(args.data)) {
          args.data.forEach((item) => {
            const istNow = getISTDate();
            item.createdAt = istNow;
            if (!modelsWithoutUpdatedAt.includes(model)) {
              item.updatedAt = istNow;
            }
          });
        }
        return query(args);
      },
    },
  },
});
