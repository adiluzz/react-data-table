import { FilterOption } from "../filter_panel/FilterPanel.interface";
import { BaseRow, Grouping, GroupingHash, TableField } from "./DataTable.interface";

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

export function groupData<T>(data: BaseRow<T>[], field: Grouping<T>[], groupingCount: number = 0): BaseRow<T>[] {
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
    for (const key in dataByKey) {
        if (Object.prototype.hasOwnProperty.call(dataByKey, key)) {
            const element = dataByKey[key];
            const groupedData: BaseRow<T>[] = groupingCount + 1 < field.length ? groupData(element, field, groupingCount + 1) : element;

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
    newTableData.sort((a, b) => {
        if (a.groupedData && b.groupedData) {
            return b.groupedData.length - a.groupedData.length;
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

    return debounced;
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