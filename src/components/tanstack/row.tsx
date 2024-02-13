import { Row } from "@tanstack/react-table";
import { VirtualItem } from "@tanstack/react-virtual";
import Cell from "./cell";
import { typedMemo } from "./utils";

function TableRow<T>({
  row,
  virtualRowStart,
  virtualColumns,
  virtualPaddingLeft,
  virtualPaddingRight,
}: {
  row: Row<T>;
  virtualRowStart: number;
  virtualColumns: VirtualItem[];
  virtualPaddingLeft?: number;
  virtualPaddingRight?: number;
}) {
  const visibleCells = row.getVisibleCells();

  return (
    <tr
      className="flex absolute w-full h-11"
      style={{
        transform: `translateY(${virtualRowStart}px)`, //this should always be a `style` as it changes on scroll
      }}
    >
      {virtualPaddingLeft ? (
        //fake empty column to the left for virtualization scroll padding
        <td style={{ display: "flex", width: virtualPaddingLeft }} />
      ) : null}
      {virtualColumns.map((vc) => {
        const cell = visibleCells[vc.index];
        return <Cell key={cell.id} cell={cell} />;
      })}
      {virtualPaddingRight ? (
        //fake empty column to the right for virtualization scroll padding
        <td style={{ display: "flex", width: virtualPaddingRight }} />
      ) : null}
    </tr>
  );
}

export default TableRow;
