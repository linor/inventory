"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StorageLocation } from "@/generated/prisma";
import Link from "next/dist/client/link";
import { Button } from "@/components/ui/button";
import SortedFilteredList from "@/components/table/SortedFilteredList";
import { groupByParent, GroupedStorageLocation } from "./util";

export default function LocationList({
    location: locations,
    showNewButton,
}: {
    location: StorageLocation[];
    showNewButton: boolean;
}) {
    const groupedLocations = groupByParent(locations);

    const columns: ColumnDef<GroupedStorageLocation>[] = [
        {
            accessorKey: "location.name",
            header: "Name",
            cell: (info) => (
                <Link
                    href={`/location/${info.row.original.location.id}`}
                    style={{
                        paddingLeft: `${8 + info.row.original.indentation * 16}px`,
                    }}
                >
                    {info.getValue() ? (
                        (info.getValue() as React.ReactNode)
                    ) : (
                        <span className="text-gray-400">Unnamed Location</span>
                    )}
                </Link>
            ),
        },
        {
            accessorKey: "location.contents",
            header: "Contents",
            cell: (info) => (
                <>
                    {info.getValue() ? (
                        (info.getValue() as React.ReactNode)
                    ) : (
                        <span className="text-gray-400">Storage container</span>
                    )}
                </>
            ),
        },
        {
            accessorKey: "location.id",
            header: () => <div className="w-[100px] text-right">ID</div>,
            cell: (info) => (
                <div className="text-right">
                    {info.getValue() as React.ReactNode}
                </div>
            ),
        },
    ];

    return (
        <>
            <SortedFilteredList
                data={groupedLocations}
                columns={columns}
                pageSize={15}
                searchPlaceholder="Search Locations..."
            >
                {showNewButton && (
                    <Link href="/location/new" className="ml-2">
                        <Button>Add New Location</Button>
                    </Link>
                )}
            </SortedFilteredList>
        </>
    );
}
