"use client";

import SortedFilteredList from "@/components/table/SortedFilteredList";
import { Category, Item, StorageLocation } from "@/generated/prisma";
import { Button, Link } from "@heroui/react";
import { ColumnDef } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
};

type ItemWithCategoryAndLocation = Item & {
    category: Category | null;
    location: StorageLocation | null;
};

type ItemListProps = {
    items: ItemWithCategoryAndLocation[];
    showNewButton?: boolean;
};

const columns: ColumnDef<ItemWithCategoryAndLocation>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
            <Link href={`/item/${info.row.original.id}`}>
                {info.getValue() ? (
                    (info.getValue() as React.ReactNode)
                ) : (
                    <span className="text-gray-400">Unnamed Item</span>
                )}
            </Link>
        ),
    },
    {
        accessorFn: (row) => row.category?.name || null,
        header: "Category",
        cell: (info) => (
            <>
                {info.getValue() ? (
                    (info.getValue() as React.ReactNode)
                ) : (
                    <span className="text-gray-400">No Category</span>
                )}
            </>
        ),
    },
    {
        accessorFn: (row) => row.location?.name || null,
        header: "Location",
        cell: (info) => (
            <>
                {info.getValue() ? (
                    (info.getValue() as React.ReactNode)
                ) : (
                    <span className="text-gray-400">No Location</span>
                )}
            </>
        ),
    },
    {
        accessorKey: "id",
        header: () => <div className="w-[100px] text-right">ID</div>,
        cell: (info) => (
            <div className="text-right">
                {info.getValue() as React.ReactNode}
            </div>
        ),
    },
];

export default function ItemList({ items, showNewButton }: ItemListProps) {
    return (
        <SortedFilteredList
            data={items}
            columns={columns}
            pageSize={15}
            searchPlaceholder="Search Items..."
            filterFn={fuzzyFilter}
        >
            {showNewButton && (
                <Link href="/item/new" className="ml-2">
                    <Button>Add New Item</Button>
                </Link>
            )}
        </SortedFilteredList>
    );
}
