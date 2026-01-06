import { Box } from "@mui/material";
import { useState } from "react";
import { Collapsible } from "../common/Collapsible";
import ConditionalArrow from "../common/ConditionalArrow";
import { useDataTableContext } from "../data_table/DataTable.context";
import { GroupedRow, TableField } from "../data_table/DataTable.interface";
import { numberWithCommas } from "../data_table/DataTable.utils";
import Table from "./Table";
import { FullWidthTableDetail, GroupedCell, GroupedIndentation, TableRowWrapper } from "./Table.components";
import { useTableContext } from "./Table.context";



type GroupedTableRowProps<T> = {
    row: GroupedRow<T>;
    value: string;
    depth: number;
    fields: TableField<T>[];
}

const GroupedTableRow = <T,>(
    { row, value, depth, fields }: GroupedTableRowProps<T>) => {
    const [open, setOpen] = useState<boolean>(false);
    const ctx = useDataTableContext();
    const tableContext = useTableContext();
    return <>
        <TableRowWrapper
            onClick={() => {
                setOpen(!open);
            }}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.001)',
                },
                backgroundColor: (theme) =>
                    depth % 2 === 0
                        ? theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.03)'
                            : 'rgba(0, 0, 0, 0.02)'
                        : theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s ease-in-out',
            }}
        >
            <FullWidthTableDetail colSpan={ctx?.columns?.length}>
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
                        <Box component="span">{value}</Box>
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
        <TableRowWrapper>
            <FullWidthTableDetail colSpan={tableContext?.columns?.length}>
                <Collapsible $open={open}>
                    <GroupedIndentation $indentation={depth} />
                    <Table
                        data={row.groupedData || []}
                        fields={fields}
                        renderHeaders={(ctx?.tableGroupings?.length || -1) - 1 === depth}
                        depth={depth + 1}
                    />
                </Collapsible>
            </FullWidthTableDetail>
        </TableRowWrapper>
    </>
};

export default GroupedTableRow;