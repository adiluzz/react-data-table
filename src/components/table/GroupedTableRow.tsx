import { useState } from "react";
import { useDataTableContext } from "../../DataTable.context";
import { GroupedRow, TableField } from "../../DataTable.interface";
import { numberWithCommas } from "../../DataTable.utils";
import { Collapsible } from "../common/Collapsible";
import ConditionalArrow from "../common/ConditionalArrow";
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
        <TableRowWrapper onClick={() => {
            setOpen(!open);
        }}>
            <FullWidthTableDetail colSpan={ctx?.columns?.length}>
                <GroupedCell>
                    <GroupedIndentation $indentation={depth} />
                    <div>{value} <strong>({numberWithCommas(row.groupedData?.length as number)})</strong></div>
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