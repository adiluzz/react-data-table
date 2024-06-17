import { createContext, useContext } from "react";
import { BaseRow, Grouping, TableField } from "./DataTable.interface";


type DataTableState<T = Record<string, never>> = {
    tableData?: BaseRow<T>[];
    setTableData?:React.Dispatch<React.SetStateAction<BaseRow<T>[] | undefined>>;
    tableGroupings?: Grouping<T>[];
    setTableGroupings?: React.Dispatch<React.SetStateAction<Grouping<T>[] | undefined>>;
    columns?: TableField<T>[];
    setColumns?: React.Dispatch<React.SetStateAction<TableField<T>[] | undefined>>
}

const DataTableContext = createContext<DataTableState<unknown> | null>(null);

export function useDataTableContext<T>(){
    return useContext<DataTableState<T> | null>(DataTableContext);
}
export default DataTableContext;

