import { Table, TableBody, TableHead } from "@mui/material";
import { FC, ReactNode } from "react";
import { TableWrapper } from "./Table.components";
import TableHeaders from "./TableHeaders";


type TableConditionalProps = {
    children: ReactNode | ReactNode[];
    renderHeaders: boolean;
};

const TableConditional: FC<TableConditionalProps> = ({ children, renderHeaders }) => {
    return <TableWrapper>
        <Table
            sx={{
                minWidth: 650,
                '& .MuiTableCell-root': {
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                },
            }}
            size="medium"
            stickyHeader
        >
            {
                renderHeaders &&
                <TableHead>
                    <TableHeaders />
                </TableHead>
            }
            <TableBody>
                {children}
            </TableBody>
        </Table>
    </TableWrapper>
};

export default TableConditional