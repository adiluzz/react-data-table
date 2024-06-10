import { GroupedRow, TableField } from "../DataTable.interface";
import Table from "../Table";

type GroupedTableRowProps<T> = {
    row: GroupedRow<T>;
    value: string;
    colspan: number;
    depth: number;
    fields: TableField<T>[]
}

const GroupedTableRow = <T,>(
    { row, value, colspan, depth, fields }: GroupedTableRowProps<T>) => {
    return <>
        <tr>
            <td align='center' colSpan={colspan} style={{ textAlign: 'left', display: 'flex' }}>
                {
                    new Array(depth).fill(' ').map((_filled, i) =>
                        <div key={i} style={{ width: '50px' }}></div>
                    )
                }
                <div>{value}</div>
            </td>
        </tr>
        <Table
            data={row.groupedData || []}
            fields={fields}
            isGrouped
            depth={depth + 1}
        />
    </>
};

export default GroupedTableRow;