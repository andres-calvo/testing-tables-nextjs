import { create } from "zustand";

interface BaseSpreadSheetStore {
  rowsData: any[];
  columns: string[];
  selected: string[];
  actions: {
    setRowsData: (rowsData: any[]) => void;
    setColumns: (columns: string[]) => void;
    onSelectRow: (rowId: string, action: "select" | "deselect") => void;
  };
}

export const useBaseSpreadsheetStore = create<BaseSpreadSheetStore>(
  (set, get) => ({
    rowsData: [],
    columns: [],
    selected: [],

    actions: {
      setRowsData: (rowsData) => {
        set({
          rowsData,
        });
      },
      setColumns: (columns) => {
        set({
          columns,
        });
      },
      onSelectRow: (rowIndex, action) => {
        if (action === "select") {
          set((state) => ({ selected: state.selected.concat(rowIndex) }));
        } else {
          set((state) => ({
            selected: state.selected.filter((index) => index !== rowIndex),
          }));
        }
      },
    },
  })
);
