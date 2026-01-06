import { createContext, useContext } from "react";
import { BaseRow, TableField } from "../data_table/DataTable.interface";


type TableState<T = Record<string, never>> = {
    tableData?: BaseRow<T>[];
    setTableData?: (rows: BaseRow<T>[]) => void;
    columns: TableField<T>[];
    setColumns: React.Dispatch<React.SetStateAction<TableField<T>[]>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

const TableContext = createContext<TableState<any> | null>(null);

export function useTableContext<T = any>(): TableState<T> | null {
    return useContext(TableContext) as TableState<T> | null;
}

export function getTableContext<T>(){
    return TableContext as React.Context<TableState<T> | null>;
}

export default TableContext;

