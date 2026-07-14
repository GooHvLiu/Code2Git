-- CreateTable
CREATE TABLE `sys_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sys_user_username_key`(`username`),
    UNIQUE INDEX `sys_user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deviceNo` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `sys_device_deviceNo_key`(`deviceNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_device` ADD CONSTRAINT `sys_device_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `sys_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
