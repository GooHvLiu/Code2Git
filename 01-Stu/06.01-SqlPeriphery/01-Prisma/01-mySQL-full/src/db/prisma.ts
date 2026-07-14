// src/db/prisma.ts
import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// 构建mysql适配器
const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  // 连接池数量
  connectionLimit: 10
});

// 全局单例，全局只创建一次客户端
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 程序退出关闭数据库连接
export default prisma;
