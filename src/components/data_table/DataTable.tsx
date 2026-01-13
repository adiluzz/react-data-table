import { Box } from "@mui/material";
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
import { getAllRowIdsFromGroup, getUniqueValues, groupData, hasFields } from './DataTable.utils';


const DataTable = <T,>({ data, fields, selectable = false, onSelectionChange }: DataTableProps<T>) => {
	const [tableData, setTableData] = useState<BaseRow<T>[]>();
	const [columns, setColumns] = useState<TableField<T>[]>();
	const [tableGroupings, setTableGroupings] = useState<Grouping<T>[] | undefined>(undefined);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filterPanelState, setFilterPanelState] = useState<Filter[]>();
	const [selectedFilters, setSelectedFilters] = useState<FilterResult[]>()
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const tableHasGroupableFields = useMemo(() => hasFields('groupable', fields), [fields]);
	const tableHasSearchableFields = useMemo(() => hasFields('searchable', fields), [fields]);
	const tableHasFilterableFields = useMemo(() => hasFields('filterable', fields), [fields]);

	// Convert T[] to BaseRow<T>[] internally for grouping support
	const convertToBaseRow = useCallback((data: T[]): BaseRow<T>[] => {
		return data.map((row, index) => ({
			...row,
			id: (row as { id?: string }).id || String(index),
		} as BaseRow<T>));
	}, []);

	const groupTableData = useCallback((data: BaseRow<T>[]) => {
		let tableRawData = [...data];
		const filtersData: Filter[] = [];
		if (searchTerm && columns) {
			tableRawData = searchFilter(tableRawData, columns as TableField<unknown>[], searchTerm);
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

	// Handle row selection change
	const handleRowSelectionChange = useCallback((rowId: string, selected: boolean) => {
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (selected) {
				newSet.add(rowId);
			} else {
				newSet.delete(rowId);
			}
			return newSet;
		});
	}, []);

	// Handle group selection change (select/deselect all rows in group)
	const handleGroupSelectionChange = useCallback((groupRow: BaseRow<T>, selected: boolean) => {
		const allIds = getAllRowIdsFromGroup(groupRow);
		setSelectedIds(prev => {
			const newSet = new Set(prev);
			if (selected) {
				allIds.forEach(id => newSet.add(id));
			} else {
				allIds.forEach(id => newSet.delete(id));
			}
			return newSet;
		});
	}, []);

	// Notify parent of selection changes
	useEffect(() => {
		if (onSelectionChange) {
			onSelectionChange(Array.from(selectedIds));
		}
	}, [selectedIds, onSelectionChange]);

	useEffect(() => {
		setColumns(fields);
		const baseRowData = convertToBaseRow(data);
		groupTableData(baseRowData);
	}, [data, fields, groupTableData, tableGroupings, convertToBaseRow]);
	return (
		<DataTableContext.Provider
			value={{
				tableData: tableData as BaseRow<unknown>[] | undefined,
				setTableData: setTableData as React.Dispatch<React.SetStateAction<BaseRow<unknown>[] | undefined>> | undefined,
				tableGroupings: tableGroupings as Grouping<unknown>[] | undefined,
				setTableGroupings: setTableGroupings as React.Dispatch<React.SetStateAction<Grouping<unknown>[] | undefined>> | undefined,
				columns: columns as TableField<unknown>[] | undefined,
				setColumns: setColumns as React.Dispatch<React.SetStateAction<TableField<unknown>[] | undefined>> | undefined,
				searchTerm,
				setSearchTerm,
				filterPanelState,
				setFilterPanelState,
				selectedFilters,
				setSelectedFilters,
				getHeader: getHeader as (property: string) => TableField<unknown> | undefined
			}}
		>
			{
				tableHasFilterableFields &&
				<FilterPanel />
			}
			{
				(tableHasGroupableFields || tableHasSearchableFields) &&
				<BottomPanelWrapper>
					{tableHasGroupableFields ? <GroupingPanel /> : <Box />}
					{
						tableHasSearchableFields &&
						<SearchBar
							onChange={(val) => {
								setSearchTerm(val);
							}}
							debounceTime={1000}
						/>
					}
				</BottomPanelWrapper>
			}
			{
				tableData && columns &&
				<Table<T>
					data={tableData}
					fields={columns}
					renderHeaders={true}
					selectable={selectable}
					selectedIds={selectedIds}
					onRowSelectionChange={selectable ? handleRowSelectionChange : undefined}
					onGroupSelectionChange={selectable ? handleGroupSelectionChange : undefined}
				/>
			}
		</DataTableContext.Provider>
	);
};
export default DataTable;
