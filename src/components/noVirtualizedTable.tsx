import { useBaseSpreadsheetStore } from "@/store";

const VirtualizedTanstackTable = () => {
  const rowData = useBaseSpreadsheetStore((state) => state.rowsData);
  const columns = useBaseSpreadsheetStore((state) => state.columns);

  return (
    <div
      className="container"
      style={{
        overflow: 'auto', //our scrollable table container
        position: 'relative', //needed for sticky header
        height: '500px', //should be a fixed height,
      }}
    >
      <table>
        <tbody>
          <tr>
            {Array.isArray(columns) &&
              columns.map((column) => (<th key={column.id}>{column.label}</th>
              ))}
          </tr>
          {rowData.map((row, index) => (
            <tr key={row.id}>
              {columns.map(col => (<td key={`${col.name}`}>{row[col.name]}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default VirtualizedTanstackTable;