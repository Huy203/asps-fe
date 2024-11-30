import { ColumnDef, flexRender, Table as TableProps } from "@tanstack/react-table";
import { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface BaseTableProps<T> {
  table: TableProps<T>;
  columns: ColumnDef<T>[];
  onClickItem?: (row: T) => void;
  notFound?: ReactNode;
  loading?: boolean;
  className?: string;
}

export const BaseTable = <T,>(props: BaseTableProps<T>) => {
  const { table, columns = [], onClickItem, loading = false, notFound, className } = props;

  return (
    <Table className={className}>
      <TableHeader className="">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className=" ">
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    "text-dark px-4 text-[14px]",
                    `w-[${header.column.columnDef.size}px]`
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>

      {loading ? (
        <TableBody className="bg-white">
          <TableRow className="h-36 w-full">
            <TableCell colSpan={columns.length} className="items-center text-center">
              Loading...
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody className="bg-white">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    !!onClickItem && "cursor-pointer",
                    row.getIsSelected() ? "" : "[&:hover_button]:opacity-100 [&_button]:opacity-0"
                  )}
                  {...(onClickItem ? { onClick: () => onClickItem(row.original) } : {})}
                >
                  {row.getVisibleCells().map((cell) => {
                    const size = cell.column.getSize();
                    return (
                      <TableCell key={cell.id} className="px-4" width={size}>
                        <div className="text-[14px]">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {notFound ? notFound : "No result"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      )}
    </Table>
  );
};
