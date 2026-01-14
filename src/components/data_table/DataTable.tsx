import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

// Create a stable reference for fields by comparing only non-function properties
// This prevents infinite loops when renderComponent functions are new references
const getFieldsKey = <T,>(fields: TableField<T>[]): string => {
	return fields.map(field => {
		return JSON.stringify({
			key: String(field.key),
			headerText: field.headerText,
			sortable: field.sortable,
			sorted: field.sorted,
			groupable: field.groupable,
			searchable: field.searchable,
			filterable: field.filterable,
			width: field.width,
		});
	}).join('|');
};


const DataTable = <T,>({ data, fields, selectable = false, onSelectionChange }: DataTableProps<T>) => {
	const [tableData, setTableData] = useState<BaseRow<T>[]>();
	const [tableGroupings, setTableGroupings] = useState<Grouping<T>[] | undefined>(undefined);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [filterPanelState, setFilterPanelState] = useState<Filter[]>();
	const [selectedFilters, setSelectedFilters] = useState<FilterResult[]>()
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	
	// Use refs to store the latest fields and a stable key to detect actual changes
	const fieldsRef = useRef<TableField<T>[]>(fields);
	const fieldsKeyRef = useRef<string>('');
	const currentFieldsKey = getFieldsKey(fields);
	
	// Always store the latest fields (for renderComponent functions)
	fieldsRef.current = fields;
	
	// Track if the key changed (structure changed, not just function references)
	if (currentFieldsKey !== fieldsKeyRef.current) {
		fieldsKeyRef.current = currentFieldsKey;
	}
	
	// Use the latest fields reference (always has current renderComponent functions)
	const stableFields = fieldsRef.current;
	
	// Store columns in state, but only update when structure changes (not when function references change)
	const [columnsState, setColumnsState] = useState<TableField<T>[]>(fields);
	
	// Update columns state only when structure changes
	useEffect(() => {
		setColumnsState(fieldsRef.current);
	}, [currentFieldsKey]); // Only update when structure changes
	
	// Merge latest renderComponent functions into columns on every render
	// This ensures renderComponent is always current without triggering structure-dependent re-renders
	// We do this on every render (not in useMemo) to always get the latest renderComponent
	const columns: TableField<T>[] = columnsState.map((col, index) => {
		const latestField = fieldsRef.current[index];
		if (latestField && String(latestField.key) === String(col.key)) {
			return {
				...col,
				renderComponent: latestField.renderComponent, // Always use latest renderComponent
			};
		}
		return col;
	});
	// stableFields only changes when currentFieldsKey changes, so including both is safe
	const tableHasGroupableFields = useMemo(() => hasFields('groupable', stableFields), [currentFieldsKey, stableFields]);
	const tableHasSearchableFields = useMemo(() => hasFields('searchable', stableFields), [currentFieldsKey, stableFields]);
	const tableHasFilterableFields = useMemo(() => hasFields('filterable', stableFields), [currentFieldsKey, stableFields]);

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
			// Use stableFields for iteration, but access current fields for renderComponent if needed
			for (let i = 0; i < stableFields.length; i++) {
				const field = stableFields[i];
				if (field.filterable) {
					filtersData.push({
						property: field.key as string,
						values: getUniqueValues(tableRawData as never[], field.key as string)
					});
				}
			}
		}
		setFilterPanelState(filtersData);
		
		// Extract sort state from columns
		const sortedColumn = columns?.find(col => col.sorted);
		const sortField = sortedColumn?.key ? String(sortedColumn.key) : undefined;
		const sortDirection = sortedColumn?.sorted;
		
		if (tableGroupings && tableGroupings.length > 0) {
			setTableData(groupData(tableRawData, tableGroupings, 0, sortField, sortDirection));
		} else {
			setTableData(tableRawData);
		}
	}, [searchTerm, columns, selectedFilters, tableHasFilterableFields, tableGroupings, currentFieldsKey, stableFields]);

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

	// Clean up selected IDs when data changes - remove IDs that no longer exist in the data
	// Optimized: Build hash map of valid IDs, then filter selectedIds in single pass
	useEffect(() => {
		if (!selectable) return;
		
		const baseRowData = convertToBaseRow(data);
		// Build hash map of valid IDs for O(1) lookup
		const validIds = new Set<string>();
		
		// Single pass to build valid IDs hash map
		for (let i = 0; i < baseRowData.length; i++) {
			const row = baseRowData[i];
			if (row.id) {
				validIds.add(row.id);
			}
		}
		
		// Single pass to filter selected IDs using hash map lookup
		setSelectedIds(prev => {
			// If no selected IDs, return early
			if (prev.size === 0) return prev;
			
			const newSet = new Set<string>();
			prev.forEach(id => {
				if (validIds.has(id)) {
					newSet.add(id);
				}
			});
			return newSet;
		});
	}, [data, selectable, convertToBaseRow]);

	
	// Separate effect for data processing - only depends on stable field key, not function references
	useEffect(() => {
		const baseRowData = convertToBaseRow(data);
		groupTableData(baseRowData);
	}, [data, currentFieldsKey, groupTableData, tableGroupings, convertToBaseRow]);
	return (
		<DataTableContext.Provider
			value={{
				tableData: tableData as BaseRow<unknown>[] | undefined,
				setTableData: setTableData as React.Dispatch<React.SetStateAction<BaseRow<unknown>[] | undefined>> | undefined,
				tableGroupings: tableGroupings as Grouping<unknown>[] | undefined,
				setTableGroupings: setTableGroupings as React.Dispatch<React.SetStateAction<Grouping<unknown>[] | undefined>> | undefined,
				columns: columns as TableField<unknown>[] | undefined,
				setColumns: undefined, // Columns are now derived, not state
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
