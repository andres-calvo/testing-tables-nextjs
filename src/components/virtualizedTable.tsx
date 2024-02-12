import { useRef, Fragment, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const VirtualTable = () => {
  const parentRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [columns, setColumns] = useState([]);
  const headerCount = 1;
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
  const rowHeight = 40
  return (
    <div className="w-2/3 h-96 overflow-auto text-black" ref={parentRef}>
      <div
        className=""
        style={{
          width: `${columnVirtualizer.getTotalSize()}px`,
          height: `${(rowData.length + headerCount) * rowHeight}px`,
          position: "relative",
        }}
      >
        <div
          className="sticky top-0 border border-gray-500 shadow-lg z-10 bg-white"
          style={{
            height: rowHeight,
          }}
        >
          {columnVirtualizer.getVirtualItems().map((col) => (
            <div
              key={col.key}
              className="border"
              style={{
                height: rowHeight,
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
        {/* {rowData.map((row, index) => (
          <Fragment key={row.id}>
            {columnVirtualizer.getVirtualItems().map((col) => (
              <div
                key={`${row}/${col.key}`}
                style={{
                  position: "absolute",
                  height: rowHeight,
                  width: col.size,
                  top: 0,
                  left: 0,
                  transform: `translateX(${col.start}px) translateY(${(index + headerCount) * rowHeight
                    }px)`,
                }}
              >
                {rowData[index][columns[col.index]]}
              </div>
            ))}
          </Fragment>
        ))} */}
      </div>

      <p className="fixed bottom-0">
        {columns.length} Columnas X {rowData.length} Filas
      </p>
    </div>
  );
};

export default VirtualTable;
