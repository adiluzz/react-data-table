import { BaseRow, TableField } from "../data_table/DataTable.interface";

export const optionFilter = <T>(property: string, value: string, data: BaseRow<T>[]):BaseRow<T>[] => {
    return data?.filter(row => {
        if (row[property as keyof typeof row]) {
            return row[property as keyof typeof row] === value;
        }
    })
};

export function searchFilter<T>(data: BaseRow<T>[], cols: TableField[], searchTerm: string) {
    const rawData = [...data];
    const searchableCols = cols.filter(col => col.searchable);
    return rawData.filter(row => {
        for (let i = 0; i < searchableCols.length; i++) {
            const key = searchableCols[i].key;
            if (row[key as keyof typeof row].toLowerCase().includes(searchTerm.toLowerCase())) {
                return true;
            }
        }
        return false;
    })
}