export type SortDirection = 'asc' | 'desc';

export interface TableField<T> {
    key: keyof T | string;
    renderComponent?: (row: BaseRow<T>) => JSX.Element;
    headerText: string;
    sortable?: boolean;
    sorted?: SortDirection;
    groupable?: boolean;
}

export type GroupedRow<T> = {
    groupedBy?: {
        groupField: Grouping<T>;
        value: string;
    };
    groupedData?: BaseRow<T>[];
};

export type NonGroupedRow<T> = {
    [key in keyof T]?: never;
} & {
    id?: string;
}

export type BaseRow<T> = NonGroupedRow<T> & GroupedRow<T>;

export type Grouping<T> = keyof BaseRow<T>;

export type DataTableProps<T> = {
    data: BaseRow<T>[];
    fields: TableField<T>[];
};

export type TableProps<T> = DataTableProps<T> & {
    onSort?: (col: keyof T, direction: SortDirection) => void;
    onDragHeaderStart?:(col: keyof T, ev: React.DragEvent<HTMLTableHeaderCellElement>) => void;
    
}

export type GroupingHash<T> = {
    [key: string]: BaseRow<T>[];
};


