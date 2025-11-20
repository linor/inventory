-- DropForeignKey
ALTER TABLE `CategoryKey` DROP FOREIGN KEY `CategoryKey_categoryId_fkey`;

-- AddForeignKey
ALTER TABLE `CategoryKey` ADD CONSTRAINT `CategoryKey_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
