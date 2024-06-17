import { TableProps } from "../DataTable.interface";
import GroupedTableRow from './GroupedTableRow';
import TableConditional from './TableConditional';

const Table = <T,>({ data, fields, renderHeaders, depth = 0 }: TableProps<T>) => {
    return <TableConditional
        renderHeaders={!!renderHeaders}
    >
        {data && data.map((row) => (
            row.groupedData ?
                <GroupedTableRow
                    value={row.groupedBy?.value || ''}
                    depth={depth}
                    row={row}
                    fields={[...fields]}
                    key={row.id}
                />
                :
                <tr key={row.id}>
                    {fields.map((field) => (
                        <td key={String(field.key)} >
                            {field.renderComponent
                                ? field.renderComponent(row)
                                : row[field.key as never]}
                        </td>
                    ))}
                </tr>
        ))}
    </TableConditional>
};


export default Table;