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
}

// Public API - users provide T[] directly
export type DataTableProps<T> = {
    data: T[];
    fields: TableField<T>[];
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
}

export type GroupingHash<T> = {
    [key: string]: BaseRow<T>[];
};
