import { create } from "zustand";
const baseColumn = {
  "id": 1331,
  "name": "",
  "label": "",
  "is_system_column": true,
  "is_chained_column": false,
  "is_generated": false,
  "query": null,
  "position": 1,
  "is_new_version": true,
  "is_group_aggregation_column": false,
  "is_hidden_by_user": false,
  "is_hidden_for_everyone": false,
  "is_rec_manual_hidden_by_user": false,
  "origin_column": null,
  "is_union_column": false,
  "v_lookup_is_orphan": false,
  "due_column": null,
  "reasons_not_editable": null,
  "format_parameters": {
    "length": 60
  },
  "is_cast_locked": false,
  "is_inheritable_column": true,
  "is_column_cast": false,
  "display_format_parameters": {},
  "is_hidden": false,
  "is_processing": false,
  "is_draft": false,
  "active": true,
  "uniqueness": null,
  "resource": 13339,
  "v_lookup_column": null,
  "parent": null,
  "hidden_by": [],
  "data_format": {
    "id": 3,
    "name": "string",
    "data_type": "string",
    "parameters": {
      "length": "integer"
    },
    "support_multiple": false
  },
  "transformations": [],
  "mapped_by_external_app": false
}
interface BaseSpreadSheetStore {
  rowsData: Record<string,string|number>[];
  columns: typeof baseColumn[];
  selected: string[];
  actions: {
    setRowsData: (rowsData: Record<string,string|number>[]) => void;
    setColumns: (columns: typeof baseColumn[]) => void;
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
