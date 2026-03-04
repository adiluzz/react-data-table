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
import { getAllRowIdsFromGroup, getUniqueValues, groupData, hasFields, loadTableStateFromLocalStorage, saveTableStateToLocalStorage } from './DataTable.utils';

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


const DataTable = <T,>({ data, fields, selectable = false, onSelectionChange, localStorageKey }: DataTableProps<T>) => {
	// Load initial state from localStorage if key is provided
	const savedState = useMemo(() => {
		if (localStorageKey) {
			return loadTableStateFromLocalStorage(localStorageKey);
		}
		return null;
	}, [localStorageKey]);

	// Initialize state from localStorage or defaults
	const [tableData, setTableData] = useState<BaseRow<T>[]>();
	const [tableGroupings, setTableGroupings] = useState<Grouping<T>[] | undefined>(
		savedState?.tableGroupings as Grouping<T>[] | undefined
	);
	const [searchTerm, setSearchTerm] = useState<string>(savedState?.searchTerm || '');
	const [filterPanelState, setFilterPanelState] = useState<Filter[]>();
	const [selectedFilters, setSelectedFilters] = useState<FilterResult[] | undefined>(
		savedState?.selectedFilters
	);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(
		new Set(savedState?.selectedIds || [])
	);
	
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
	
	// Store columns in state, but only update when structure changes (not when function references change)
	// Apply saved sort state on initial load
	const hasAppliedInitialSort = useRef(false);
	const initialColumns = useMemo(() => {
		if (savedState?.sortState && !hasAppliedInitialSort.current) {
			hasAppliedInitialSort.current = true;
			return fields.map(field => {
				if (String(field.key) === savedState.sortState!.field) {
					return { ...field, sorted: savedState.sortState!.direction };
				}
				return { ...field, sorted: undefined };
			});
		}
		return fields;
	}, [savedState, fields]);

	const [columnsState, setColumnsState] = useState<TableField<T>[]>(initialColumns);

	// Track current sort state - use ref for preserving across structure changes, state for triggering saves
	const sortStateRef = useRef<{ field: string; direction: 'asc' | 'desc' } | null>(
		savedState?.sortState || null
	);
	const [sortState, setSortState] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(
		savedState?.sortState || null
	);
	
	// Handle sort changes from Table component
	const handleSortChange = useCallback((field: string, direction: 'asc' | 'desc' | undefined) => {
		const newSortState = direction ? { field, direction } : null;
		sortStateRef.current = newSortState;
		setSortState(newSortState);
		
		// Update columnsState to reflect the sort change
		setColumnsState(prev => prev.map(col => {
			if (String(col.key) === field) {
				return { ...col, sorted: direction };
			}
			return { ...col, sorted: undefined };
		}));
	}, []);

	// Update columns state only when structure changes, but preserve sort state if the sorted field still exists
	useEffect(() => {
		const newColumns = fieldsRef.current.map(field => {
			// If we had a sort state and this field matches, preserve it
			if (sortStateRef.current && String(field.key) === sortStateRef.current.field) {
				return { ...field, sorted: sortStateRef.current.direction };
			}
			return { ...field, sorted: undefined };
		});
		setColumnsState(newColumns);
	}, [currentFieldsKey]); // Only update when structure changes
	
	// Merge latest renderComponent functions into columns
	// Use useMemo to prevent creating new array on every render, but always use latest renderComponent
	// The key insight: columnsState only changes when structure changes, but we always merge latest renderComponent
	// We access fieldsRef.current inside the memo (not in deps) so it always gets the latest renderComponent
	const columns = useMemo(() => {
		// Access fieldsRef.current inside the memo to get latest renderComponent functions
		const latestFields = fieldsRef.current;
		return columnsState.map((col, index) => {
			const latestField = latestFields[index];
			if (latestField && String(latestField.key) === String(col.key)) {
				return {
					...col,
					renderComponent: latestField.renderComponent, // Always use latest renderComponent
				};
			}
			return col;
		});
	}, [columnsState]); // Only recalculate when structure changes - fieldsRef.current is accessed inside, always latest
	
	// Use fieldsRef.current directly to avoid dependency issues - it's always the latest
	const tableHasGroupableFields = useMemo(() => hasFields('groupable', fieldsRef.current), [currentFieldsKey]);
	const tableHasSearchableFields = useMemo(() => hasFields('searchable', fieldsRef.current), [currentFieldsKey]);
	const tableHasFilterableFields = useMemo(() => hasFields('filterable', fieldsRef.current), [currentFieldsKey]);

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
		// Use fieldsRef.current (always has latest) instead of columns to avoid dependency issues
		const currentColumns = fieldsRef.current;
		if (searchTerm && currentColumns) {
			tableRawData = searchFilter(tableRawData, currentColumns as TableField<unknown>[], searchTerm);
		}
		if (selectedFilters) {
			for (let i = 0; i < selectedFilters.length; i++) {
				tableRawData = optionFilter(selectedFilters[i].property, selectedFilters[i].value, tableRawData)
			}
		}
		if (tableHasFilterableFields) {
			// Use fieldsRef.current directly (always has latest) for iteration
			for (let i = 0; i < fieldsRef.current.length; i++) {
				const field = fieldsRef.current[i];
				if (field.filterable) {
					filtersData.push({
						property: field.key as string,
						values: getUniqueValues(tableRawData as never[], field.key as string)
					});
				}
			}
		}
		setFilterPanelState(filtersData);
		
		// Extract sort state from current columns (always has latest)
		const sortedColumn = currentColumns?.find(col => col.sorted);
		const sortField = sortedColumn?.key ? String(sortedColumn.key) : undefined;
		const sortDirection = sortedColumn?.sorted;
		
		if (tableGroupings && tableGroupings.length > 0) {
			setTableData(groupData(tableRawData, tableGroupings, 0, sortField, sortDirection));
		} else {
			setTableData(tableRawData);
		}
	}, [searchTerm, selectedFilters, tableHasFilterableFields, tableGroupings, currentFieldsKey]);

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

	
	// Separate effect for data processing - re-run when data, fields, groupings or selected filters change
	useEffect(() => {
		const baseRowData = convertToBaseRow(data);
		groupTableData(baseRowData);
	}, [data, currentFieldsKey, groupTableData, tableGroupings, convertToBaseRow, selectedFilters]);

	// Debounced save to localStorage - only save once after all changes settle
	const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const prevStateRef = useRef<string>('');
	
	useEffect(() => {
		if (!localStorageKey) return;

		// Serialize current state for comparison
		const currentStateStr = JSON.stringify({
			tableGroupings: tableGroupings ? tableGroupings.map(g => String(g)).sort().join(',') : '',
			searchTerm: searchTerm || '',
			selectedFilters: selectedFilters ? JSON.stringify(selectedFilters.sort((a, b) => a.property.localeCompare(b.property) || a.value.localeCompare(b.value))) : '',
			selectedIds: selectedIds.size > 0 ? Array.from(selectedIds).sort().join(',') : '',
			sortState: sortState ? `${sortState.field}:${sortState.direction}` : '',
		});

		// Only save if state actually changed
		if (currentStateStr === prevStateRef.current) {
			return;
		}

		prevStateRef.current = currentStateStr;

		// Clear any pending save
		if (saveTimeoutRef.current) {
			clearTimeout(saveTimeoutRef.current);
		}

		// Debounce the save by 300ms to batch multiple rapid changes
		saveTimeoutRef.current = setTimeout(() => {
			const stateToSave = {
				tableGroupings: tableGroupings ? tableGroupings.map(g => String(g)) : undefined,
				searchTerm: searchTerm || undefined,
				selectedFilters: selectedFilters || undefined,
				selectedIds: selectedIds.size > 0 ? Array.from(selectedIds) : undefined,
				sortState: sortState || undefined,
			};

			saveTableStateToLocalStorage(localStorageKey, stateToSave);
		}, 300);

		// Cleanup timeout on unmount
		return () => {
			if (saveTimeoutRef.current) {
				clearTimeout(saveTimeoutRef.current);
			}
		};
	}, [localStorageKey, tableGroupings, searchTerm, selectedFilters, selectedIds, sortState]);

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
							value={searchTerm}
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
					onSortChange={handleSortChange}
				/>
			}
		</DataTableContext.Provider>
	);
};
export default DataTable;
