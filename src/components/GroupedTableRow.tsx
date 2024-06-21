import { useState } from "react";
import styled from "styled-components";
import { useDataTableContext } from "../DataTable.context";
import { GroupedRow, TableField } from "../DataTable.interface";
import ConditionalArrow from "./common/ConditionalArrow";
import Table from "./modules/table/Table";
import { useTableContext } from "./modules/table/Table.context";


const TableRowWrapper = styled.tr({
    width: '100%',
    textAlign: 'left',
});


const FullWidthTableDetail = styled.td`
    display: table-cell;
`;

const GroupedCell = styled.div({
    display: 'flex',
    flexDirection: 'row'
});

const GroupedIndentation = styled.span<{ $indentation: number }>(({ $indentation }) => {
    return {
        width: 50 * $indentation,
        display: 'inline-block',
        height: 10
    }
});


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
        <TableRowWrapper onClick={() => {
            setOpen(!open);
        }}>
            <FullWidthTableDetail colSpan={ctx?.columns?.length}>
                <GroupedCell>
                    <GroupedIndentation $indentation={depth} />
                    <div>{value} <strong>({row.groupedData?.length})</strong></div>
                    <ConditionalArrow condition={open} />
                </GroupedCell>
            </FullWidthTableDetail>
        </TableRowWrapper >
        <TableRowWrapper>
            <FullWidthTableDetail colSpan={tableContext?.columns?.length}>
                <div className={`collapsible ${open && 'open'}`}>
                    <GroupedIndentation $indentation={depth} />
                    <Table
                        data={row.groupedData || []}
                        fields={fields}
                        renderHeaders={(ctx?.tableGroupings?.length || -1) - 1 === depth}
                        depth={depth + 1}
                    />
                </div>
            </FullWidthTableDetail>
        </TableRowWrapper>
    </>
};

export default GroupedTableRow;