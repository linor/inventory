"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { StorageLocation } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/dist/client/link";
import TablePaging from "./Paging";

type GroupedStorageLocation = {
  location: StorageLocation;
  indentation: number;
};

function groupByParent(
  locations: StorageLocation[],
  parentId: string | null = null,
  indentation: number = 0,
): GroupedStorageLocation[] {
  const grouped: GroupedStorageLocation[] = [];
  locations
    .filter((location) => location.parentId === parentId)
    .forEach((location) => {
      grouped.push({ location, indentation });
      grouped.push(...groupByParent(locations, location.id, indentation + 1));
    });

  return grouped;
}

export default function LocationList({
  location: locations,
}: {
  location: StorageLocation[];
}) {
  const groupedLocations = groupByParent(locations);

  const columns: ColumnDef<GroupedStorageLocation>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => (
        <div
          style={{ paddingLeft: `${8 + info.row.original.indentation * 16}px` }}
        >
          {info.getValue()}
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: () => <div className="w-[100px] text-right">ID</div>,
      cell: (info) => <div className="text-right">{info.getValue()}</div>,
    },
  ];

  const [data, setData] = useState(() =>
    groupedLocations.map(({ location, indentation }) => ({
      name: (
        <Link href={`/location/${location.id}`}>
          {location.name || (
            <span className="text-gray-400">Unnamed Location</span>
          )}
        </Link>
      ),
      id: location.id,
      indentation,
    })),
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  });

  return (
    <>
      <div className="mt-4 mb-4 w-full overflow-hidden rounded-xl border">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted font-heavy">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <TablePaging table={table} />
      </div>
    </>
  );
}
