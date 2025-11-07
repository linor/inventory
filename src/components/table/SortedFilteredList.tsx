"use client";

import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    flexRender,
    FilterFn,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "@heroui/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import TablePaging from "./Paging";

type SortedFilteredListProps<E> = {
    children: React.ReactNode;
    columns: ColumnDef<E>[];
    data: E[];
    pageSize?: number;
    searchPlaceholder?: string;
    filterFn?: FilterFn<E>;
};

export default function SortedFilteredList<E>({
    children,
    columns,
    data,
    pageSize = 10,
    searchPlaceholder = "Search...",
    filterFn,
}: SortedFilteredListProps<E>) {
    const [contents, setContents] = useState(data);
    const [globalFilter, setGlobalFilter] = useState<any>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize,
    });

    const table = useReactTable({
        data: contents,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: filterFn,
        state: { pagination, globalFilter },
    });

    return (
        <>
            <div className="mb-4 flex items-center gap-2">
                <Input
                    className="flex-1"
                    placeholder={searchPlaceholder}
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
                {children}
            </div>
            <div className="mt-4 mb-4 w-full overflow-hidden rounded-xl border">
                <Table className="w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="bg-muted font-heavy"
                            >
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
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
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
