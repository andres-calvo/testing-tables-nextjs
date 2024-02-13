import { Cell, flexRender } from "@tanstack/react-table";
import { typedMemo } from "./utils";

function TableCell<T>({ cell }: { cell: Cell<T, unknown> }) {
  return (
    <td
      key={cell.id}
      className="flex"
      style={{
        width: cell.column.getSize(),
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
}
export default typedMemo(TableCell);
