import { FilterOption, FilterResult } from "../filter_panel/FilterPanel.interface";
import { BaseRow, Grouping, GroupingHash, SortDirection, TableField } from "./DataTable.interface";

// Type for saved table state in localStorage
export type SavedTableState = {
    tableGroupings?: string[]; // Grouping fields as strings
    searchTerm?: string;
    selectedFilters?: FilterResult[];
    selectedIds?: string[]; // Array of selected row IDs
    sortState?: {
        field: string;
        direction: SortDirection;
    };
};

export function hasFields<T>(input: keyof TableField<T>, fields: TableField<T>[]): boolean {
    return !!fields?.find(field => field[input]);
}

// Helper function to convert any value to a string for grouping
function getGroupKey(value: unknown): string {
    if (value === null || value === undefined) {
        return String(value);
    }
    if (typeof value === 'object') {
        // For objects, try JSON.stringify, but handle circular references
        try {
            return JSON.stringify(value);
        } catch (e) {
            // Fallback for circular references or other issues
            return String(value);
        }
    }
    return String(value);
}

export function groupData<T>(
    data: BaseRow<T>[], 
    field: Grouping<T>[], 
    groupingCount: number = 0,
    sortField?: keyof T | string,
    sortDirection?: 'asc' | 'desc'
): BaseRow<T>[] {
    const dataByKey = data.reduce((prev, cur) => {
        const curField = cur[field[groupingCount] as keyof BaseRow<T>];
        if (curField !== null && curField !== undefined) {
            const groupKey = getGroupKey(curField);
            if (prev[groupKey]) {
                prev[groupKey].push(cur);
            } else {
                prev[groupKey] = [cur];
            }
        }
        return prev;
    }, {} as GroupingHash<T>);

    const newTableData: BaseRow<T>[] = [];
    const currentGroupField = field[groupingCount];
    // Normalize both fields for comparison - handle both string and keyof T types
    const currentGroupFieldStr = String(currentGroupField).trim();
    const sortFieldStr = sortField ? String(sortField).trim() : '';
    const isSortingByGroupField = sortFieldStr && sortFieldStr === currentGroupFieldStr;
    
    for (const key in dataByKey) {
        if (Object.prototype.hasOwnProperty.call(dataByKey, key)) {
            const element = dataByKey[key];
            // Recursively group nested levels - this will also sort nested groups
            // The recursive call will sort at the nested level if sortField matches that level's grouping field
            const groupedData: BaseRow<T>[] = groupingCount + 1 < field.length 
                ? groupData(element, field, groupingCount + 1, sortField, sortDirection) 
                : element;

            newTableData.push({
                groupedBy: {
                    groupField: field[groupingCount],
                    value: key,
                },
                groupedData,
                id: key
            } as unknown as BaseRow<T>);
        }
    }
    
    // Sort groups at this level: if sorting by the current grouped field, sort by group value
    // Otherwise, sort by group size (default behavior)
    // Note: Nested groups are already sorted by the recursive call above
    
    newTableData.sort((a, b) => {
        if (a.groupedData && b.groupedData) {
            if (isSortingByGroupField && sortDirection) {
                // Sort by group value when sorting by this grouping field
                const aValue = a.groupedBy?.value || '';
                const bValue = b.groupedBy?.value || '';
                let ret: number;
                if (aValue < bValue) {
                    ret = -1;
                } else if (aValue > bValue) {
                    ret = 1;
                } else {
                    ret = 0;
                }
                return sortDirection === 'asc' ? ret : -ret;
            } else {
                // Default: sort by group size
                return b.groupedData.length - a.groupedData.length;
            }
        }
        return 0;
    });
    return newTableData;

}

export function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
    func: F,
    waitFor: number,
) => {
    let timeout: NodeJS.Timeout;

    const debounced = (...args: Parameters<F>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    }

    (debounced as typeof debounced & { cancel: () => void }).cancel = () => {
        clearTimeout(timeout);
    };

    return debounced as typeof debounced & { cancel: () => void };
};

export const getUniqueValues = (data: never[], key: string): FilterOption[] => {
    const values: { [key: string]: number } = {};
    for (let i = 0; i < data.length; i++) {
        const rowValue = data[i][key];
        if (values[rowValue]) {
            values[rowValue]++;
        } else {
            values[rowValue] = 1;
        }
    }
    return Object.keys(values).map(val => {
        return {
            value: val,
            count: values[val]
        }
    }).sort((a, b) => b.count - a.count);
}

/**
 * Recursively get all row IDs from a group (including nested groups)
 */
export function getAllRowIdsFromGroup<T>(groupRow: BaseRow<T>): string[] {
    const ids: string[] = [];
    
    if (groupRow.groupedData) {
        for (const row of groupRow.groupedData) {
            if (row.groupedData) {
                // This is a nested group, recurse
                ids.push(...getAllRowIdsFromGroup(row));
            } else if (row.id) {
                // This is a regular row
                ids.push(row.id);
            }
        }
    }
    
    return ids;
}

/**
 * Save table state to localStorage
 */
export function saveTableStateToLocalStorage(key: string, state: SavedTableState): void {
    try {
        localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
        console.warn('Failed to save table state to localStorage:', error);
    }
}

/**
 * Load table state from localStorage
 */
export function loadTableStateFromLocalStorage(key: string): SavedTableState | null {
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            return JSON.parse(saved) as SavedTableState;
        }
    } catch (error) {
        console.warn('Failed to load table state from localStorage:', error);
    }
    return null;
}