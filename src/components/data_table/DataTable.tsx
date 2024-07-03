import { useCallback, useEffect, useMemo, useState } from "react";
import FilterPanel from "../filter_panel/FilterPanel";
import { Filter, FilterResult } from "../filter_panel/FilterPanel.interface";
import { optionFilter, searchFilter } from "../filter_panel/Filters";
import GroupingPanel from '../grouping/GroupingPanel';
import SearchBar from "../search/SearchBar";
import Table from '../table/Table';
import { BottomPanelWrapper } from "./DataTable.components";
import DataTableContext from './DataTable.context';
import { BaseRow, DataTableProps, Grouping, TableField } from './DataTable.interface';
import { getUniqueValues, groupData, hasFields } from './DataTable.utils';


const DataTable = <T,>({ data, fields }: DataTableProps<T>) => {
	const [tableData, setTableData] = useState<BaseRow<T>[]>();
	const [columns, setColumns] = useState<TableField<T>[]>();
	const [tableGroupings, setTableGroupings] = useState<Grouping<T>[]>();
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filterPanelState, setFilterPanelState] = useState<Filter[]>();
	const [selectedFilters, setSelectedFilters] = useState<FilterResult[]>()
	const tableHasGroupableFields = useMemo(() => hasFields('groupable', fields), [fields]);
	const tableHasSearchableFields = useMemo(() => hasFields('searchable', fields), [fields]);
	const tableHasFilterableFields = useMemo(() => hasFields('filterable', fields), [fields]);


	const groupTableData = useCallback((data: BaseRow<T>[]) => {
		let tableRawData = [...data];
		const filtersData: Filter[] = [];
		if (searchTerm && columns) {
			tableRawData = searchFilter(tableRawData, columns, searchTerm);
		}
		if (selectedFilters) {
			for (let i = 0; i < selectedFilters.length; i++) {
				tableRawData = optionFilter(selectedFilters[i].property, selectedFilters[i].value, tableRawData)
			}
		}
		if (tableHasFilterableFields) {
			for (let i = 0; i < fields.length; i++) {
				const field = fields[i];
				if (field.filterable) {
					filtersData.push({
						property: field.key as string,
						values: getUniqueValues(tableRawData as never[], field.key as string)
					});
				}
			}
		}
		setFilterPanelState(filtersData);
		if (tableGroupings && tableGroupings.length > 0) {
			setTableData(groupData(tableRawData, tableGroupings));
		} else {
			setTableData(tableRawData);
		}
	}, [searchTerm, columns, selectedFilters, tableHasFilterableFields, tableGroupings, fields]);

	const getHeader = (property: string): TableField<T> | undefined => {
		return columns?.find(col => col.key === property);
	}

	useEffect(() => {
		setColumns(fields);
		groupTableData(data);
	}, [data, fields, groupTableData, tableGroupings]);
	return (
		<DataTableContext.Provider
			value={{
				tableData,
				setTableData,
				tableGroupings,
				setTableGroupings,
				columns,
				setColumns,
				searchTerm,
				setSearchTerm,
				filterPanelState,
				setFilterPanelState,
				selectedFilters,
				setSelectedFilters,
				getHeader
			}}
		>
			{
				tableHasFilterableFields &&
				<FilterPanel />
			}
			{
				(tableHasGroupableFields || tableHasSearchableFields) &&
				<BottomPanelWrapper>
					{tableHasGroupableFields && <GroupingPanel />}
					{tableHasSearchableFields && <SearchBar />}
				</BottomPanelWrapper>
			}
			{
				tableData && columns &&
				<Table<T>
					data={tableData}
					fields={columns}
					renderHeaders={true}
				/>
			}
		</DataTableContext.Provider>
	);
};
export default DataTable;
