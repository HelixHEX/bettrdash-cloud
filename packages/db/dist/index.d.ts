import { PrismaClient } from "@prisma/client";
declare global {
    var prisma: PrismaClient | undefined;
}
interface BasicPrismaModel {
    fields: any;
    findUnique: any;
    findMany: any;
}
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation | undefined, import("@prisma/client/runtime").DefaultArgs>;
export { PrismaClient };
export type { BasicPrismaModel };
export * from "@prisma/client";
//# sourceMappingURL=index.d.ts.map