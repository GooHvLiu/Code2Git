// src/script.ts
console.log("脚本启动成功 ==========");

import prisma from "./db/prisma";

async function main() {
  // 1. 创建用户 + 同时创建2台设备（嵌套写入，单事务）
  const user = await prisma.user.create({
    data: {
      username: "zhangsan",
      email: "zhangsan@test.com",
      password: "123456",
      nickname: "张三",
      devices: {
        create: [
          { deviceNo: "DEV001", name: "数控车床", status: 1 },
          { deviceNo: "DEV002", name: "检测仪", status: 0 }
        ]
      }
    },
    // 查询时带出关联设备
    include: { devices: true }
  });
  console.log("创建用户：", user);

  // 2. 查询单条数据（根据id）
  const findUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { devices: true }
  });

  // 3. 条件查询多条 + 分页 + 排序
  const userList = await prisma.user.findMany({
    skip: 0, // 跳过多少条
    take: 10, // 每页条数
    where: { status: 1 },
    orderBy: { createdAt: "desc" }
  });

  // 4. 更新数据
  await prisma.user.update({
    where: { id: user.id },
    data: { nickname: "张三工程师" }
  });

  // 5. 批量更新（无返回单条对象，适合批量操作）
  await prisma.device.updateMany({
    where: { userId: user.id },
    data: { status: 1 }
  });

  // 6. 删除单条
  await prisma.device.delete({ where: { deviceNo: "DEV002" } });

  // 7. 批量删除
  await prisma.device.deleteMany({ where: { status: 0 } });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
