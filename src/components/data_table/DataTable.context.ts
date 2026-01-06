import { createContext, useContext } from "react";
import { Filter, FilterResult } from "../filter_panel/FilterPanel.interface";
import { BaseRow, Grouping, TableField } from "./DataTable.interface";


type DataTableState<T = Record<string, never>> = {
    tableData?: BaseRow<T>[];
    setTableData?: React.Dispatch<React.SetStateAction<BaseRow<T>[] | undefined>>;
    tableGroupings?: Grouping<T>[];
    setTableGroupings?: React.Dispatch<React.SetStateAction<Grouping<T>[] | undefined>>;
    columns?: TableField<T>[];
    setColumns?: React.Dispatch<React.SetStateAction<TableField<T>[] | undefined>>;
    page?: number;
    setPage?: React.Dispatch<React.SetStateAction<number>>;
    pageSize?: number;
    setPageSize?: React.Dispatch<React.SetStateAction<number>>;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filterPanelState?: Filter[];
    setFilterPanelState?: React.Dispatch<React.SetStateAction<Filter[] | undefined>>;
    selectedFilters?: FilterResult[];
    setSelectedFilters: React.Dispatch<React.SetStateAction<FilterResult[] | undefined>>;
    getHeader: (property: string) => TableField<T> | undefined;
}

const DataTableContext = createContext<DataTableState<any> | null>(null);

export function useDataTableContext<T = any>(): DataTableState<T> | null {
    return useContext(DataTableContext) as DataTableState<T> | null;
}
export default DataTableContext;

