import VirtualTable from "@/components/virtualizedTableReactWindow";
import { useBaseSpreadsheetStore } from "@/store";
import React, { useEffect } from "react";

const TestPage = () => {
  const actions = useBaseSpreadsheetStore((state) => state.actions);

  useEffect(() => {
    fetch("http://localhost:4000/api").then(async (res) => {
      const { columnsData, rowsData } = await res.json();
      actions.setColumns(columnsData);
      actions.setRowsData(rowsData);
    });
  }, []);

  const onSelect = () => {
    const input = document.getElementById("rowIndex") as HTMLInputElement;
    const index = input.value;
    if (index) {
      const action = useBaseSpreadsheetStore.getState().selected.includes(index)
        ? "deselect"
        : "select";
      actions.onSelectRow(index, action);
    }
  };

  return (
    <div>
      <VirtualTable />

      <div className="mt-4">
        <h2>Test de seleccionar una fila</h2>
        <div className="flex gap-4 items-end">
          <label className="flex flex-col w-36">
            RowIndex
            <input type="number" className="border" id="rowIndex" />
          </label>
          <button
            type="button"
            onClick={onSelect}
            className="bg-blue-500 rounded-lg px-4 py-1"
          >
            Seleccionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
