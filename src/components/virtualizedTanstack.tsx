import { useBaseSpreadsheetStore } from "@/store";
import { ColumnDef, Row, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { VirtualItem, useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useMemo, useRef } from "react";

const VirtualizedTanstackTable = () => {
  const rowData = useBaseSpreadsheetStore((state) => state.rowsData);
  const columns = useBaseSpreadsheetStore((state) => state.columns);
  const tableCols = useMemo(() => columns.map(col => ({
    accessorKey: col.name,
    header: col.label,
    size: 200,
  })), [columns])

  const table = useReactTable({
    data: rowData,
    columns: tableCols,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,

  })

  const { rows } = table.getRowModel()

  const visibleColumns = table.getVisibleLeafColumns()

  //The virtualizers need to know the scrollable container element
  const tableContainerRef = useRef<HTMLDivElement>(null)

  //we are using a slightly different virtualization strategy for columns (compared to virtual rows) in order to support dynamic row heights
  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: useCallback((index => visibleColumns[index].getSize()),[visibleColumns]), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: useCallback(() => tableContainerRef.current,[]),
    horizontal: true,
    overscan: 3, //how many columns to render on each side off screen each way (adjust this for performance)
  })
  //dynamic row height virtualization - alternatively you could use a simpler fixed row height strategy without the need for `measureElement`
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: useCallback(() => 44,[]), //estimate row height for accurate scrollbar dragging
    getScrollElement: useCallback(() => tableContainerRef.current,[]),
    overscan: 5,
  })

  const virtualColumns = columnVirtualizer.getVirtualItems()
  const virtualRows = rowVirtualizer.getVirtualItems()

  //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
  let virtualPaddingLeft: number | undefined
  let virtualPaddingRight: number | undefined

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0
    virtualPaddingRight =
      columnVirtualizer.getTotalSize() -
      (virtualColumns[virtualColumns.length - 1]?.end ?? 0)
  }

  return (
    <div
      className="overflow-auto relative h-[500px]"
      ref={tableContainerRef}
    >
      {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
      <table className="grid" >
        <thead
          className="grid sticky top-0 z-[1]"
        >
          {table.getHeaderGroups().map(headerGroup => (
            <tr
              key={headerGroup.id}
              className="flex w-full"
            >
              {virtualPaddingLeft ? (
                //fake empty column to the left for virtualization scroll padding
                <th className="flex" style={{ width: virtualPaddingLeft }} />
              ) : null}
              {virtualColumns.map(vc => {
                const header = headerGroup.headers[vc.index]
                return (
                  <th
                    key={header.id}
                    className="flex"
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </th>
                )
              })}
              {virtualPaddingRight ? (
                //fake empty column to the right for virtualization scroll padding
                <th className="flex" style={{ width: virtualPaddingRight }} />
              ) : null}
            </tr>
          ))}
        </thead>
        <tbody
          className="grid relative"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
          }}
        >
          {virtualRows.map(virtualRow => {
            const row = rows[virtualRow.index] as Row<{}>
            const visibleCells = row.getVisibleCells()

            return (
              <tr
                key={row.id}
                className="flex absolute w-full h-11"
                style={{
                  transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                }}
              >
                {virtualPaddingLeft ? (
                  //fake empty column to the left for virtualization scroll padding
                  <td
                    style={{ display: 'flex', width: virtualPaddingLeft }}
                  />
                ) : null}
                {virtualColumns.map(vc => {
                  const cell = visibleCells[vc.index]
                  return (
                    <td
                      key={cell.id}
                      style={{
                        display: 'flex',
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
                {virtualPaddingRight ? (
                  //fake empty column to the right for virtualization scroll padding
                  <td
                    style={{ display: 'flex', width: virtualPaddingRight }}
                  />
                ) : null}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
export default VirtualizedTanstackTable;

const TableRow = ({virtualRow}:{virtualRow:VirtualItem})=>{

}