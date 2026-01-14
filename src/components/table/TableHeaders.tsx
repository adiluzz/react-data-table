import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SortIcon from '@mui/icons-material/Sort';
import { Checkbox, TableRow } from '@mui/material';
import { useMemo } from 'react';
import { BaseRow, SortDirection } from '../data_table/DataTable.interface';
import { getAllRowIdsFromGroup } from '../data_table/DataTable.utils';
import { TableHeaderIconWrapper, TableHeaderTextWrapper, TableHeaderWrapper } from './Table.components';
import { useTableContext } from './Table.context';

type TableHeadersProps<T> = {
    selectable?: boolean;
    selectedIds?: Set<string>;
    onRowSelectionChange?: (rowId: string, selected: boolean) => void;
    onGroupSelectionChange?: (groupRow: BaseRow<T>, selected: boolean) => void;
};

const TableHeaders = <T,>({ selectable, selectedIds, onRowSelectionChange, onGroupSelectionChange }: TableHeadersProps<T>) => {
    const ctx = useTableContext<T>();
    const sortData = (field: keyof T, direction: SortDirection) => {
        const sortedData = ctx?.tableData?.sort((a, b) => {
            // Check if both rows are grouped and if the sorted field matches the group field
            const aIsGrouped = a.groupedData && a.groupedBy;
            const bIsGrouped = b.groupedData && b.groupedBy;
            
            if (aIsGrouped && bIsGrouped) {
                // Both are groups - check if sorting by the grouped field
                const aGroupField = a.groupedBy?.groupField;
                const bGroupField = b.groupedBy?.groupField;
                const isSortingByGroupField = String(aGroupField) === String(field) && String(bGroupField) === String(field);
                
                if (isSortingByGroupField) {
                    // Sort by group value
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
                    return direction === 'asc' ? ret : -ret;
                }
            }
            
            // Default sorting behavior for non-grouped rows or when sorting by non-grouped field
            let ret;
            const aField = a[field];
            const bField = b[field];
            if (aField && bField) {
                ret = aField < bField ? -1 : aField > bField ? 1 : 0;
            }
            else {
                ret = aField ? 1 : bField ? -1 : 0;
            }
            return direction === 'asc' ? ret : -ret;
        });

        if (ctx?.setTableData && sortedData) {
            ctx?.setTableData(sortedData);
        }
        ctx?.setColumns && ctx?.setColumns(cols => cols?.map((col) => {
            col.sorted = col.key === field ? direction : undefined;
            return col;
        }));
    };

    // Optimize selection checking with single pass and hash map
    const { allSelected, someSelected } = useMemo(() => {
        if (!selectable || !selectedIds || !ctx?.tableData) {
            return { allSelected: false, someSelected: false };
        }
        
        const ctxData = ctx.tableData;
        let totalCount = 0;
        let selectedCount = 0;
        
        // Single pass through data to count selectable and selected items
        for (let i = 0; i < ctxData.length; i++) {
            const row = ctxData[i];
            if (row.groupedData) {
                // For grouped rows, get all IDs from the group
                const groupIds = getAllRowIdsFromGroup(row);
                totalCount += groupIds.length;
                for (let j = 0; j < groupIds.length; j++) {
                    if (selectedIds.has(groupIds[j])) {
                        selectedCount++;
                    }
                }
            } else if (row.id) {
                // For regular rows, check the ID directly
                totalCount++;
                if (selectedIds.has(row.id)) {
                    selectedCount++;
                }
            }
        }
        
        return {
            allSelected: totalCount > 0 && selectedCount === totalCount,
            someSelected: selectedCount > 0
        };
    }, [selectable, selectedIds, ctx?.tableData]);

    const handleSelectAll = (checked: boolean) => {
        if (!ctx?.tableData) return;
        ctx.tableData.forEach(row => {
            if (row.groupedData && onGroupSelectionChange) {
                onGroupSelectionChange(row, checked);
            } else if (!row.groupedData && row.id && onRowSelectionChange) {
                onRowSelectionChange(row.id, checked);
            }
        });
    };

    return <TableRow key={'table-headers'}>
        {selectable && (
            <TableHeaderWrapper 
                $draggable={false}
                $isCheckbox={true}
                className="checkbox-cell"
            >
                <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                />
            </TableHeaderWrapper>
        )}
        {ctx?.columns && ctx?.columns.map((field, index) => (
            <TableHeaderWrapper
                draggable={field.groupable}
                onDragStart={(ev) => {
                    return ev.dataTransfer.setData("text", field.key as string);
                }}
                key={String(field.key)}
                $draggable={!!field.groupable}
                $width={field.width}
                sx={selectable && index === 0 ? { paddingLeft: '0 !important' } : undefined}
            >
                <TableHeaderTextWrapper>
                    {field.headerText}
                </TableHeaderTextWrapper>
                {
                    field.sortable &&
                    <TableHeaderIconWrapper>
                        {(
                            field.sorted === 'desc' ?
                                <ArrowDropUpIcon
                                    sx={{
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        color: 'primary.main',
                                        transition: 'color 0.2s ease-in-out',
                                        '&:hover': {
                                            color: 'primary.dark',
                                        },
                                    }}
                                    onClick={() => {
                                        sortData(field.key as keyof T, 'asc');
                                    }}
                                />
                                : field.sorted === 'asc' ?
                                    <ArrowDropDownIcon
                                        sx={{
                                            cursor: 'pointer',
                                            fontSize: '20px',
                                            color: 'primary.main',
                                            transition: 'color 0.2s ease-in-out',
                                            '&:hover': {
                                                color: 'primary.dark',
                                            },
                                        }}
                                        onClick={() => {
                                            sortData(field.key as keyof T, 'desc');
                                        }}
                                    />
                                    :
                                    <SortIcon
                                        sx={{
                                            cursor: 'pointer',
                                            fontSize: '20px',
                                            color: 'action.disabled',
                                            transition: 'color 0.2s ease-in-out',
                                            '&:hover': {
                                                color: 'action.active',
                                            },
                                        }}
                                        onClick={() => {
                                            sortData(field.key as keyof T, 'asc');
                                        }}
                                    />
                        )}
                    </TableHeaderIconWrapper>
                }
            </TableHeaderWrapper>
        ))}
    </TableRow>
}

export default TableHeaders;