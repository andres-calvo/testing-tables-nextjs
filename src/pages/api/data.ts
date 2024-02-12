// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid"

const generateColumns = (cols: number) => {
    return Array.from({ length: cols }, (_, x) => `col-${x}`).concat("id");
};
const generateRandomString = () => {
    return (Math.random() + 1).toString(36).substring(2);
};
const generateRows = (columns: string[], rows: number) => {
    return Array.from({ length: rows }, (_, x) => {
        const map = new Map();
        map.set("id", uuidv4());
        columns.forEach((col) => {
            map.set(col, generateRandomString());
        });
        return Object.fromEntries(map);
    });
};
const SIZE = 1999
const columnsData = generateColumns(SIZE)
const rowsData = generateRows(columnsData, 100)
export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    res.status(200).json({
        columnsData,
        rowsData
    });
}

export const config = {
    api: {
        responseLimit: false,
    },
}