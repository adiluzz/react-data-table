import { Box, Checkbox, Paper } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { defaultPageSizeOptions } from "../data_table/DataTable.const";
import { BaseRow, TableField, TableProps } from "../data_table/DataTable.interface";
import Pagination from "../pagination/Pagination";
import GroupedTableRow from "./GroupedTableRow";
import { TableDetail, TableOverflowContainer, TableRowWrapper } from "./Table.components";
import { getTableContext } from "./Table.context";
import TableConditional from "./TableConditional";


const Table = <T,>({ data, fields, renderHeaders, depth = 0, selectable = false, selectedIds, onRowSelectionChange, onGroupSelectionChange }: TableProps<T>) => {
    const TableContext = getTableContext<T>();
    const [tableData, setTableData] = useState<BaseRow<T>[]>(data);
    const [curData, setCurData] = useState<BaseRow<T>[]>();
    const [columns, setColumns] = useState<TableField<T>[]>(fields);
    const isNestedTable = depth > 0;


    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defaultPageSizeOptions[0]);

    const setTableDataAction = useCallback((rows: BaseRow<T>[]) => {
        setTableData(rows);
        const start = page * pageSize;
        const end = start + pageSize;
        const paginatedData = rows.slice(start, end);
        setCurData(paginatedData);
    }, [page, pageSize]);

    useEffect(() => {
        setTableDataAction(data);
    }, [data, setTableDataAction])

    return <TableContext.Provider
        value={{
            tableData,
            setTableData: setTableDataAction,
            columns,
            setColumns,
            page,
            setPage,
            pageSize,
            setPageSize
        }}
    >
        <Box
            component={isNestedTable ? 'div' : Paper}
            elevation={isNestedTable ? undefined : 0}
            sx={{
                width: '100%',
                overflow: isNestedTable ? 'visible' : 'hidden',
                borderRadius: isNestedTable ? 0 : 2,
                boxShadow: 'none !important',
                backgroundColor: 'transparent',
                '&.MuiPaper-root': {
                    boxShadow: 'none !important',
                },
            }}
        >
            <TableOverflowContainer
                $isNested={isNestedTable}
                sx={isNestedTable ? { overflow: 'visible', width: '100%', margin: 0, padding: 0 } : {}}
            >
                <TableConditional
                    renderHeaders={!!renderHeaders}
                    selectable={selectable}
                    selectedIds={selectedIds}
                    onRowSelectionChange={onRowSelectionChange}
                    onGroupSelectionChange={onGroupSelectionChange}
                >
                    {curData && curData.map((row) => {
                        // Format the grouped value for display
                        let displayValue = row.groupedBy?.value || '';
                        
                        // If the value is a JSON string (from object grouping), try to parse and extract a meaningful value
                        if (typeof displayValue === 'string') {
                            // Check if it's a JSON object or array
                            if ((displayValue.startsWith('{') || displayValue.startsWith('[')) && displayValue !== '[object Object]') {
                                try {
                                    const parsed = JSON.parse(displayValue);
                                    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                                        // Try common display properties first (in order of preference)
                                        const displayProps = ['name', 'title', 'label', 'displayName', 'display', 'id', 'value', 'text', 'description'];
                                        for (const prop of displayProps) {
                                            if (parsed[prop] !== undefined && parsed[prop] !== null) {
                                                displayValue = String(parsed[prop]);
                                                break;
                                            }
                                        }
                                        
                                        // If no common property found, try to find the first meaningful string property
                                        if (displayValue === row.groupedBy?.value) {
                                            const stringProps = Object.entries(parsed).find(([, v]) => 
                                                typeof v === 'string' && v.length > 0 && v.length < 100
                                            );
                                            if (stringProps && typeof stringProps[1] === 'string') {
                                                displayValue = stringProps[1];
                                            } else {
                                                // Last resort: use the first property value that's not an object
                                                const firstProp = Object.values(parsed).find(v => 
                                                    v !== null && v !== undefined && typeof v !== 'object'
                                                );
                                                if (firstProp !== undefined) {
                                                    displayValue = String(firstProp);
                                                }
                                            }
                                        }
                                    } else if (Array.isArray(parsed) && parsed.length > 0) {
                                        // For arrays, show the first element or length
                                        displayValue = parsed.length === 1 ? String(parsed[0]) : `Array(${parsed.length})`;
                                    }
                                } catch (e) {
                                    // If parsing fails, keep the original value
                                    // This shouldn't happen, but if it does, we'll show the raw string
                                }
                            } else if (displayValue === '[object Object]') {
                                // This shouldn't happen if getGroupKey works correctly, but handle it anyway
                                displayValue = 'Object';
                            }
                        }
                        
                        return row.groupedData ? (
                            <GroupedTableRow
                                value={String(displayValue)}
                                depth={depth}
                                row={row}
                                fields={[...fields]}
                                key={row.id}
                                selectable={selectable}
                                selectedIds={selectedIds}
                                onRowSelectionChange={onRowSelectionChange}
                                onGroupSelectionChange={onGroupSelectionChange}
                            />
                        ) : (
                            <TableRowWrapper
                                key={row.id}
                                hover
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
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
                                    >
                                        <Checkbox
                                            checked={row.id ? selectedIds?.has(row.id) || false : false}
                                            onChange={(e) => {
                                                if (row.id && onRowSelectionChange) {
                                                    onRowSelectionChange(row.id, e.target.checked);
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </TableDetail>
                                )}
                                {fields.map((field, index) => (
                                    <TableDetail 
                                        key={String(field.key)} 
                                        $width={field.width}
                                        sx={selectable && index === 0 ? { paddingLeft: '0 !important' } : undefined}
                                    >
                                        {field.renderComponent
                                            ? field.renderComponent(row as T)
                                            : row[field.key as never]}
                                    </TableDetail>
                                ))}
                            </TableRowWrapper>
                        );
                    })}

                </TableConditional>
            </TableOverflowContainer>
        </Box>
        {!isNestedTable && <Pagination<T> />}
    </TableContext.Provider >
};


export default Table;