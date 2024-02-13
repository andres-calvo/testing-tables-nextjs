import { Header, flexRender } from "@tanstack/react-table";
import { typedMemo } from "./utils";

function HeaderCell<T>({ header }: { header: Header<T, unknown> }) {
  return (
    <th
      key={header.id}
      className="flex border"
      style={{
        width: header.getSize(),
      }}
    >
      <div>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </div>
    </th>
  );
}

export default typedMemo(HeaderCell);
