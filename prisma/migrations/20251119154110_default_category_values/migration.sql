-- AlterTable
ALTER TABLE `Category` ADD COLUMN `defaultLabelVariant` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `CategoryKey` ADD COLUMN `defaultValue` VARCHAR(191) NULL;
