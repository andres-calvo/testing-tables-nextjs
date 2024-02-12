import { useBaseSpreadsheetStore } from "@/store";
import { CSSProperties, useCallback, useRef } from "react";
import { FixedSizeGrid as Grid, GridOnScrollProps, } from "react-window";
import { FixedSizeList as List } from "react-window";

const columnsHeader = 1

const VirtualTableReactWindow = () => {
  const rowsLength = useBaseSpreadsheetStore((state) => state.rowsData.length);
  const columnsLength = useBaseSpreadsheetStore((state) => state.columns.length)
  const headerListRef = useRef<HTMLDivElement | null>(null)
  const selectedChecksRef = useRef<HTMLDivElement | null>(null)
  const onScroll = useCallback(
    ({ scrollTop, scrollLeft, scrollUpdateWasRequested }: GridOnScrollProps) => {
      if (!scrollUpdateWasRequested) {
        headerListRef.current?.scrollTo({ left: scrollLeft, top: 0 });
        selectedChecksRef.current?.scrollTo({ left: 0, top: scrollTop })
      }
    }, []
  );
  const rowHeight = 45
  const colWidth = 200
  const tableHeight = 450
  const tableWidth = 750
  if (rowsLength == 0 || columnsLength == 0) return null;
  return (
    <div className="flex">
      <List
        outerRef={selectedChecksRef}
        style={{ overflowY: "hidden", marginTop: rowHeight }}
        layout="vertical"
        itemCount={rowsLength}
        itemSize={rowHeight}
        height={tableHeight}
        width={40}
      >
        {CheckCell}
      </List>
      <div>
        <List
          outerRef={headerListRef}
          style={{ overflowX: "hidden" }}
          layout="horizontal"
          itemCount={columnsLength}
          itemSize={colWidth}
          height={rowHeight}
          width={tableWidth}
        >
          {HeaderCell}
        </List>


        <Grid
          columnCount={columnsLength}
          columnWidth={colWidth}
          height={tableHeight}
          rowCount={rowsLength}
          rowHeight={rowHeight}
          onScroll={onScroll}
          width={tableWidth}
          overscanColumnCount={10}
          overscanRowCount={20}
        >
          {Cell}
        </Grid>
      </div>

    </div>



  );
};

export default VirtualTableReactWindow;
function HeaderCell({ index,
  style, }: {
    index: number;
    style: CSSProperties;
  }) {
  return (<div style={style}>{`Col-${index}`}</div>)
}

function CheckCell({ index,
  style, }: {
    index: number;
    style: CSSProperties;
  }) {
  const actions = useBaseSpreadsheetStore((state) => state.actions)

  return (
    <div style={style} className="flex justify-center items-start pt-2">
      <input type="checkbox"
        onChange={(event) => {
          actions.onSelectRow(index.toString(), event.target.checked ? "select" : "deselect")
        }}
      ></input>
    </div>

  )
}

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
  const isRowSelected = useBaseSpreadsheetStore((state) =>
    state.selected.includes(rowIndex.toString())
  );

  return (
    <div
      style={{
        ...style,
        ...(isRowSelected ? { color: "lightblue" } : {}),
      }}
    >
      {column}/{data}
    </div>
  );
}
