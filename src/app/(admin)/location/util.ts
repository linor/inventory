import { StorageLocation } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export type LocationOption = StorageLocation & {
    label: string;
};

export type StorageLocationWithRelations = StorageLocation & {
    parent?: StorageLocationWithRelations | null;
    children?: StorageLocationWithRelations[];
};

export function groupLocations(
    locations: StorageLocation[],
    excludeIds: string[] = [],
    parentId: string | null = null,
    prefix: string = "",
): LocationOption[] {
    let grouped: LocationOption[] = [];
    const filteredLocations = locations.filter(
        (loc) => loc.parentId === parentId,
    );

    for (const loc of filteredLocations) {
        if (excludeIds.includes(loc.id)) {
            continue;
        }

        const label = prefix ? `${prefix} > ${loc.name}` : loc.name;

        grouped.push({
            ...loc,
            label,
        });

        grouped = grouped.concat(
            groupLocations(locations, excludeIds, loc.id, label),
        );
    }

    return grouped;
}

export async function getAllParents(
    location?: StorageLocationWithRelations | null,
): Promise<StorageLocationWithRelations[]> {
    if (!location) return [];

    const parents: StorageLocationWithRelations[] = [];
    for (let current = location.parent; current; current = current.parent) {
        parents.push(current);
        if (current.parentId && !current.parent) {
            current.parent = await prisma.storageLocation.findUnique({
                where: { id: current.parentId },
                include: { parent: true },
            });
        }
    }
    return parents;
}

export type GroupedStorageLocation = {
    location: StorageLocation;
    indentation: number;
};

export function groupByParent(
    locations: StorageLocation[],
    parentId: string | null = null,
    indentation: number = 0,
): GroupedStorageLocation[] {
    const grouped: GroupedStorageLocation[] = [];
    locations
        .filter((location) => location.parentId === parentId)
        .forEach((location) => {
            grouped.push({ location, indentation });
            grouped.push(
                ...groupByParent(locations, location.id, indentation + 1),
            );
        });

    return grouped;
}