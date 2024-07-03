export type SortDirection = 'asc' | 'desc';

export interface TableField<T = object> {
    key: keyof T | string | number | symbol;
    renderComponent?: (row: BaseRow<T>) => JSX.Element;
    headerText: string;
    sortable?: boolean;
    sorted?: SortDirection;
    groupable?: boolean;
    searchable?: boolean;
    filterable?: boolean;
}

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

export type BaseRow<T = Record<string, never>> = NonGroupedRow<T> & GroupedRow<T>;

export type Grouping<T> = keyof BaseRow<T> | string | number | symbol;

export type DataTableProps<T> = {
    data: BaseRow<T>[];
    fields: TableField<T>[];
};

export type DragHeaderStart<T> = (col: keyof T, ev: React.DragEvent<HTMLTableHeaderCellElement>) => void;
export type SortTableEvent<T> = (col: keyof T, direction: SortDirection) => void;

export type TableProps<T> = DataTableProps<T> & {
    renderHeaders?: boolean;
    depth?: number;
}

export type GroupingHash<T> = {
    [key: string]: BaseRow<T>[];
};
