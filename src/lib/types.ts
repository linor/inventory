import { Category, CategoryKey } from "@/generated/prisma";

export type CategoryWithKeys = Category & {
    keys: CategoryKey[];
};