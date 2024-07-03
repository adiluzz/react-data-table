export type FilterOption = {
    count: number;
    value: string;
}

export type Filter = {
    property: string;
    values: FilterOption[];
}

export type FilterResult = {
    property: string;
    value: string;
}