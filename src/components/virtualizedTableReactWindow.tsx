import { useBaseSpreadsheetStore } from "@/store";
import { CSSProperties } from "react";
import { FixedSizeGrid as Grid } from "react-window";

const VirtualTableReactWindow = () => {
  const rowsLength = useBaseSpreadsheetStore((state) => state.rowsData.length);
  const columnsLength = useBaseSpreadsheetStore(
    (state) => state.columns.length
  );

  if (rowsLength == 0 || columnsLength == 0) return null;
  return (
    <Grid
      columnCount={columnsLength}
      columnWidth={200}
      height={450}
      rowCount={rowsLength}
      rowHeight={45}
      width={750}
      overscanColumnCount={10}
      overscanRowCount={20}
    >
      {Cell}
    </Grid>
  );
};

export default VirtualTableReactWindow;

function Cell({
  columnIndex,
  rowIndex,
  style,
}: {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
}) {
  const column = useBaseSpreadsheetStore((state) => state.columns[columnIndex]);
  const data = useBaseSpreadsheetStore(
    (state) => state.rowsData[rowIndex][column]
  );
  // const isRowSelected = useBaseSpreadsheetStore((state) =>
  //   state.selected.includes(rowIndex.toString())
  // );
  return (
    <div
      style={{
        ...style,
        // ...(isRowSelected ? { color: "lightblue" } : {}),
      }}
    >
      {column}/{data}
    </div>
  );
}
