import { type Table } from "@tanstack/react-table";
import HeaderCell from "./headerCell";
import { VirtualItem } from "@tanstack/react-virtual";

function Header<T>({
  table,
  virtualPaddingLeft,
  virtualPaddingRight,
  virtualColumns,
}: {
  table: Table<T>;
  virtualPaddingLeft?: number;
  virtualPaddingRight?: number;
  virtualColumns: VirtualItem[];
}) {
  return (
    <thead className="grid sticky top-0 z-[1] bg-white border-gray-500 border">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="flex w-full">
          {virtualPaddingLeft ? (
            //fake empty column to the left for virtualization scroll padding
            <th className="flex" style={{ width: virtualPaddingLeft }} />
          ) : null}
          {virtualColumns.map((vc) => {
            const header = headerGroup.headers[vc.index];
            return <HeaderCell key={header.id} header={header} />;
          })}
          {virtualPaddingRight ? (
            //fake empty column to the right for virtualization scroll padding
            <th className="flex" style={{ width: virtualPaddingRight }} />
          ) : null}
        </tr>
      ))}
    </thead>
  );
}

export default Header;
