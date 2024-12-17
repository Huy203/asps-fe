"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { TaskPriority, TaskStatus } from "@/lib/enums";
import { DataTableFacetedFilter } from "./faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={Object.entries(TaskStatus).map(([key, value]) => ({
              value,
              label: key,
            }))}
          />
        )}
        {table.getColumn("priorityLevel") && (
          <DataTableFacetedFilter
            column={table.getColumn("priorityLevel")}
            title="Priority"
            options={Object.entries(TaskPriority).map(([key, value]) => ({
              value,
              label: key,
            }))}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
