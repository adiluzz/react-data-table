import { Box, Checkbox } from "@mui/material";
import { useMemo, useState } from "react";
import { Collapsible } from "../common/Collapsible";
import ConditionalArrow from "../common/ConditionalArrow";
import { useDataTableContext } from "../data_table/DataTable.context";
import { BaseRow, GroupedRow, TableField } from "../data_table/DataTable.interface";
import { getAllRowIdsFromGroup, numberWithCommas } from "../data_table/DataTable.utils";
import Table from "./Table";
import { FullWidthTableDetail, GroupedCell, GroupedIndentation, TableDetail, TableRowWrapper } from "./Table.components";



type GroupedTableRowProps<T> = {
    row: GroupedRow<T>;
    value: string;
    depth: number;
    fields: TableField<T>[];
    selectable?: boolean;
    selectedIds?: Set<string>;
    onRowSelectionChange?: (rowId: string, selected: boolean) => void;
    onGroupSelectionChange?: (groupRow: BaseRow<T>, selected: boolean) => void;
    pageSize?: number;
    setPageSize?: React.Dispatch<React.SetStateAction<number>>;
}

const GroupedTableRow = <T,>(
    { row, value, depth, fields, selectable, selectedIds, onRowSelectionChange, onGroupSelectionChange, pageSize, setPageSize }: GroupedTableRowProps<T>) => {
    const [open, setOpen] = useState<boolean>(false);
    const ctx = useDataTableContext();

    // Calculate selection state for this group - optimized with single pass
    const { allSelected, someSelected } = useMemo(() => {
        if (!selectable || !selectedIds) {
            return { allSelected: false, someSelected: false };
        }
        
        const groupRowIds = getAllRowIdsFromGroup(row as BaseRow<T>);
        if (groupRowIds.length === 0) {
            return { allSelected: false, someSelected: false };
        }
        
        // Single pass through group IDs to check selection state
        let selectedCount = 0;
        for (let i = 0; i < groupRowIds.length; i++) {
            if (selectedIds.has(groupRowIds[i])) {
                selectedCount++;
            }
        }
        
        return {
            allSelected: selectedCount === groupRowIds.length,
            someSelected: selectedCount > 0
        };
    }, [selectable, selectedIds, row]);

    // Get the field that is being grouped by and render the value using renderComponent if available
    const renderedGroupValue = useMemo(() => {
        if (!row.groupedBy?.groupField || !row.groupedData || row.groupedData.length === 0) {
            return value; // Fallback to string value
        }
        
        // Find the field that matches the grouped field
        const groupFieldKey = String(row.groupedBy.groupField);
        const groupedField = fields.find(field => String(field.key) === groupFieldKey);
        
        if (!groupedField) {
            return value; // Field not found, use string value
        }
        
        // Get the actual field value from the first row in the group
        const firstRow = row.groupedData[0] as T;
        const fieldValue = firstRow[groupedField.key as keyof T];
        
        // If the field has a renderComponent, use it
        if (groupedField.renderComponent && fieldValue !== undefined && fieldValue !== null) {
            try {
                return groupedField.renderComponent(firstRow);
            } catch (error) {
                // If renderComponent fails, fallback to string value
                console.warn('Error rendering grouped value with renderComponent:', error);
                return value;
            }
        }
        
        // No renderComponent, use the string value
        return value;
    }, [row, fields, value]);

    const handleGroupCheckboxChange = (checked: boolean) => {
        if (onGroupSelectionChange) {
            onGroupSelectionChange(row as BaseRow<T>, checked);
        }
    };

    return <>
        <TableRowWrapper
            onClick={() => {
                setOpen(!open);
            }}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
                backgroundColor: 'transparent',
                transition: 'background-color 0.15s ease-in-out',
            }}
        >
            {selectable && (
                <TableDetail 
                    key="__select" 
                    $width={50} 
                    $isCheckbox={true}
                    className="checkbox-cell"
                    sx={{ paddingRight: '0 !important' }}
                >
                    <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected && !allSelected}
                        onChange={(e) => {
                            e.stopPropagation();
                            handleGroupCheckboxChange(e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </TableDetail>
            )}
            <FullWidthTableDetail colSpan={ctx?.columns?.length || 0} sx={{ borderLeft: 'none !important', borderRight: 'none !important', borderTop: 'none', borderBottom: '1px solid', borderColor: 'divider', paddingLeft: '0 !important' }}>
                <GroupedCell>
                    <GroupedIndentation $indentation={depth} />
                    <Box
                        component="div"
                        sx={{
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            color: 'text.primary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Box component="span">{renderedGroupValue}</Box>
                        <Box
                            component="strong"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 600,
                            }}
                        >
                            ({numberWithCommas(row.groupedData?.length as number)})
                        </Box>
                    </Box>
                    <ConditionalArrow condition={open} />
                </GroupedCell>
            </FullWidthTableDetail>
        </TableRowWrapper >
        <TableRowWrapper sx={{ 
            height: 'auto',
            minHeight: 0,
            margin: 0,
            '& .MuiTableCell-root': {
                borderBottom: 'none !important',
                margin: 0,
                verticalAlign: 'top',
                height: 'auto',
            },
        }}>
            {selectable && (
                <TableDetail key="__select" $width={50} $isCheckbox={true} sx={{ border: 'none !important', verticalAlign: 'top', height: 'auto' }}>
                    {/* Empty cell to align with checkbox column */}
                </TableDetail>
            )}
            <FullWidthTableDetail colSpan={ctx?.columns?.length || 0} sx={{ border: 'none !important', verticalAlign: 'top', height: 'auto' }}>
                <Collapsible $open={open}>
                    <Box sx={{ 
                        overflow: 'visible', 
                        width: '100%', 
                        padding: 0,
                        margin: 0,
                        boxShadow: 'none !important',
                        lineHeight: 'normal',
                        marginTop: 0,
                        '& *': {
                            boxShadow: 'none !important',
                        },
                    }}>
                        <GroupedIndentation $indentation={depth} />
                        <Box sx={{ 
                            width: '100%', 
                            overflow: 'visible',
                            boxShadow: 'none !important',
                            margin: 0,
                            padding: 0,
                            marginTop: 0,
                        }}>
                            <Table
                                data={row.groupedData || []}
                                fields={fields}
                                renderHeaders={(ctx?.tableGroupings?.length || -1) - 1 === depth}
                                depth={depth + 1}
                                selectable={selectable}
                                selectedIds={selectedIds}
                                onRowSelectionChange={onRowSelectionChange}
                                onGroupSelectionChange={onGroupSelectionChange}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                            />
                        </Box>
                    </Box>
                </Collapsible>
            </FullWidthTableDetail>
        </TableRowWrapper>
    </>
};

export default GroupedTableRow;