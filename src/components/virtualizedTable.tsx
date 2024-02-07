import { useRef, Fragment, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const VirtualTable = () => {
  const parentRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const rowVirtualizer = useVirtualizer({
    count: rowData.length,
    estimateSize: () => 40,
    getScrollElement: () => parentRef.current,
  });
  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length,
    estimateSize: (i) => 200,
    getScrollElement: () => parentRef.current,
  });
  useEffect(() => {
    fetch("http://localhost:4000/api").then(async (res) => {
      const { columnsData, rowsData } = await res.json();
      setRowData(rowsData);
      setColumns(columnsData);
    });
  }, []);

  return (
    <div className="w-2/3 h-96 overflow-auto text-black" ref={parentRef}>
      <div
        style={{
          width: `${columnVirtualizer.getTotalSize()}px`,
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        <div
          className="sticky top-0 border border-gray-500 shadow-lg z-10"
          style={{
            height: 40,
          }}
        >
          {columnVirtualizer.getVirtualItems().map((col) => (
            <div
              key={col.key}
              className="border"
              style={{
                height: 40,
                position: "absolute",
                top: 0,
                left: 0,
                width: col.size,
                transform: `translateX(${col.start}px)`,
              }}
            >
              {columns[col.index]}
            </div>
          ))}
        </div>
        {rowVirtualizer.getVirtualItems().map((row) => (
          <Fragment key={row.key}>
            {columnVirtualizer.getVirtualItems().map((col) => (
              <div
                key={`${row.key}/${col.key}`}
                style={{
                  position: "absolute",
                  height: row.size,
                  width: col.size,
                  top: 0,
                  left: 0,
                  transform: `translateX(${col.start}px) translateY(${
                    row.start + 40
                  }px)`,
                }}
              >
                {rowData[row.index][columns[col.index]]}
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      <p className="fixed bottom-0">
        {columns.length} Columnas X {rowData.length} Filas
      </p>
    </div>
  );
};

export default VirtualTable;
