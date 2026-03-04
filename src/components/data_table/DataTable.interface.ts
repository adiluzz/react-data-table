export type SortDirection = 'asc' | 'desc';

// Public API - users work with T directly
export interface TableField<T = object> {
    key: keyof T | string | number | symbol;
    renderComponent?: (row: T) => JSX.Element;
    headerText: string;
    sortable?: boolean;
    sorted?: SortDirection;
    groupable?: boolean;
    searchable?: boolean;
    filterable?: boolean;
    width?: number; // Optional column width in pixels. If not provided, column width will be based on content.
}

// Public API - users provide T[] directly
export type DataTableProps<T> = {
    data: T[];
    fields: TableField<T>[];
    selectable?: boolean;
    onSelectionChange?: (selectedIds: string[]) => void;
    localStorageKey?: string; // If provided, table state will be saved to and loaded from localStorage
    /** Default rows per page. Must be one of the table page size options (e.g. 10, 25, 50, 100). If invalid, a console error is logged and the first option is used. */
    defaultPageSize?: number;
};

// Internal types for grouping (not exported in public API)
export type GroupedRow<T> = {
    groupedBy?: {
        groupField: Grouping<T>;
        value: string;
    };
    groupedData?: BaseRow<T>[];
};

export type NonGroupedRow<T> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key in keyof T]?: any;
} & {
    id?: string;
}

// Internal type for rows with grouping support
export type BaseRow<T = Record<string, never>> = NonGroupedRow<T> & GroupedRow<T>;

export type Grouping<T> = keyof T | string | number | symbol;

export type DragHeaderStart<T> = (col: keyof T, ev: React.DragEvent<HTMLTableHeaderCellElement>) => void;
export type SortTableEvent<T> = (col: keyof T, direction: SortDirection) => void;

// Internal type for Table component (uses BaseRow for grouping support)
export type TableProps<T> = {
    data: BaseRow<T>[];
    fields: TableField<T>[];
    renderHeaders?: boolean;
    depth?: number;
    selectable?: boolean;
    selectedIds?: Set<string>;
    onRowSelectionChange?: (rowId: string, selected: boolean) => void;
    onGroupSelectionChange?: (groupRow: BaseRow<T>, selected: boolean) => void;
    onSortChange?: (field: string, direction: SortDirection | undefined) => void;
    /** When provided (by DataTable), page size is controlled and persisted in localStorage */
    pageSize?: number;
    setPageSize?: React.Dispatch<React.SetStateAction<number>>;
}

export type GroupingHash<T> = {
    [key: string]: BaseRow<T>[];
};
