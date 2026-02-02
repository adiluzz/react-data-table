import { Table, TableBody, TableHead } from "@mui/material";
import { ReactNode } from "react";
import { BaseRow, SortDirection } from "../data_table/DataTable.interface";
import { TableWrapper } from "./Table.components";
import TableHeaders from "./TableHeaders";


type TableConditionalProps<T> = {
    children: ReactNode | ReactNode[];
    renderHeaders: boolean;
    selectable?: boolean;
    selectedIds?: Set<string>;
    onRowSelectionChange?: (rowId: string, selected: boolean) => void;
    onGroupSelectionChange?: (groupRow: BaseRow<T>, selected: boolean) => void;
    onSortChange?: (field: string, direction: SortDirection | undefined) => void;
};

const TableConditional = <T,>({ children, renderHeaders, selectable, selectedIds, onRowSelectionChange, onGroupSelectionChange, onSortChange }: TableConditionalProps<T>) => {
    return <TableWrapper>
            <Table
                sx={{
                    tableLayout: 'auto', // Use auto layout for content-based column widths
                    borderCollapse: 'collapse',
                    borderSpacing: 0,
                    margin: 0,
                    width: '100%',
                    '& .MuiTableCell-root': {
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        borderRight: 'none !important',
                    },
                    // Remove top border and right borders from nested table headers
                    '& .MuiTableHead .MuiTableCell-root': {
                        borderTop: 'none !important',
                        borderRight: 'none !important',
                    },
                    // Remove gap between checkbox column and first data column - AGGRESSIVE FIX
                    '& .MuiTableRow-root .MuiTableCell-root.checkbox-cell': {
                        paddingRight: '0 !important',
                        marginRight: '0 !important',
                    },
                    '& .MuiTableRow-root .MuiTableCell-root.checkbox-cell + .MuiTableCell-root': {
                        paddingLeft: '0 !important',
                        marginLeft: '0 !important',
                    },
                    // Also target header rows
                    '& .MuiTableHead .MuiTableCell-root.checkbox-cell': {
                        paddingRight: '0 !important',
                        marginRight: '0 !important',
                    },
                    '& .MuiTableHead .MuiTableCell-root.checkbox-cell + .MuiTableCell-root': {
                        paddingLeft: '0 !important',
                        marginLeft: '0 !important',
                    },
                    // Target all cells with checkbox class using more specific selectors
                    '& td.checkbox-cell, & th.checkbox-cell': {
                        paddingRight: '0 !important',
                    },
                    '& td.checkbox-cell + td, & th.checkbox-cell + th': {
                        paddingLeft: '0 !important',
                    },
                    // Ensure proper column alignment
                    '& .MuiTableRow-root .MuiTableCell-root': {
                        verticalAlign: 'middle',
                    },
                }}
                size="small"
                stickyHeader
            >
            {
                renderHeaders &&
                <TableHead>
                    <TableHeaders<T> 
                        selectable={selectable}
                        selectedIds={selectedIds}
                        onRowSelectionChange={onRowSelectionChange}
                        onGroupSelectionChange={onGroupSelectionChange}
                        onSortChange={onSortChange}
                    />
                </TableHead>
            }
            <TableBody>
                {children}
            </TableBody>
        </Table>
    </TableWrapper>
};

export default TableConditional