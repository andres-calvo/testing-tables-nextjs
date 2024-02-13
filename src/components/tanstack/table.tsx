import { useCallback, useMemo, useRef } from "react";
import { typedMemo } from "./utils";
import { useBaseSpreadsheetStore } from "@/store";
import { Row, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Header from "./header";
import { useVirtualizer } from "@tanstack/react-virtual";
import TableRow from "./row";

function Table() {
  const rowData = useBaseSpreadsheetStore((state) => state.rowsData);
  const columns = useBaseSpreadsheetStore((state) => state.columns);
  const tableCols = useMemo(
    () =>
      columns.map((col) => ({
        accessorKey: col.name,
        header: col.label,
        size: 200,
      })),
    [columns]
  );

  const table = useReactTable({
    data: rowData,
    columns: tableCols,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });
  const { rows } = table.getRowModel();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const visibleColumns = table.getVisibleLeafColumns();

  //we are using a slightly different virtualization strategy for columns (compared to virtual rows) in order to support dynamic row heights
  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: useCallback(
      (index) => visibleColumns[index].getSize(),
      [visibleColumns]
    ), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: useCallback(() => tableContainerRef.current, []),
    horizontal: true,
    overscan: 3, //how many columns to render on each side off screen each way (adjust this for performance)
  });
  //dynamic row height virtualization - alternatively you could use a simpler fixed row height strategy without the need for `measureElement`
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: useCallback(() => 44, []), //estimate row height for accurate scrollbar dragging
    getScrollElement: useCallback(() => tableContainerRef.current, []),
    overscan: 5,
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();
  const virtualRows = rowVirtualizer.getVirtualItems();

  //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  return (
    <div className="overflow-auto relative h-[500px]" ref={tableContainerRef}>
      <table className="grid">
        <Header
          table={table}
          virtualColumns={virtualColumns}
          virtualPaddingLeft={virtualPaddingLeft}
          virtualPaddingRight={virtualPaddingRight}
        />
        <tbody
          className="grid relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
          }}
        >
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<{}>;
            return (
              <TableRow
                row={row}
                virtualColumns={virtualColumns}
                virtualRowStart={virtualRow.start}
                key={virtualRow.key}
                virtualPaddingLeft={virtualPaddingLeft}
                virtualPaddingRight={virtualPaddingRight}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default typedMemo(Table);
