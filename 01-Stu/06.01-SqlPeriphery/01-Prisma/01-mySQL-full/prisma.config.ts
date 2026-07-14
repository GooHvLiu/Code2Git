// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // 指定schema文件位置
  schema: "prisma/schema.prisma",
  // 迁移文件存放目录
  migrations: {
    path: "prisma/migrations"
  },
  // CLI migrate/db pull 读取数据库连接（Prisma7要求，替代schema里的url）
  datasource: {
    url: env("DATABASE_URL")
  }
});
