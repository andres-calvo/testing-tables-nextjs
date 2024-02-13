import Table from "@/components/noVirtualizedTable";
import { useBaseSpreadsheetStore } from "@/store";
import { useEffect, useRef } from "react";

const NoVirtualpage = () => {
    const actions = useBaseSpreadsheetStore((state) => state.actions);
    const hasCalled = useRef(false)

    useEffect(() => {
        if (!hasCalled.current) {
            hasCalled.current = true
            fetch("http://localhost:4000/api").then(async (res) => {
                const { columnsData, rowsData } = await res.json();
                actions.setColumns(columnsData);
                actions.setRowsData(rowsData);
            });
        }

    }, []);
    return <Table />;
};

export default NoVirtualpage;
