import VirtualTable from "@/components/virtualizedTanstack";
import { useBaseSpreadsheetStore } from "@/store";
import { useEffect } from "react";

const Test3 = () => {
    const actions = useBaseSpreadsheetStore((state) => state.actions);

    useEffect(() => {
        fetch("/api/data").then(async (res) => {
            const { columnsData, rowsData } = await res.json();
            actions.setColumns(columnsData);
            actions.setRowsData(rowsData);
        });
    }, []);
    return <VirtualTable />;
};

export default Test3;
