import VirtualTable from "@/components/tanstack/table";
import { useBaseSpreadsheetStore } from "@/store";
import { useEffect, useRef } from "react";

const Test3 = () => {
  const actions = useBaseSpreadsheetStore((state) => state.actions);
  const hasCalled = useRef(false);
  useEffect(() => {
    if (!hasCalled.current) {
      hasCalled.current = true;
      fetch("http://localhost:4000/api").then(async (res) => {
        const { columnsData, rowsData } = await res.json();
        actions.setColumns(columnsData);
        actions.setRowsData(rowsData);
      });
    }
  }, []);
  return <VirtualTable />;
};

export default Test3;
