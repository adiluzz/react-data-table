import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { TableProps } from "./DataTable.interface";
import GroupedCell from './components/GroupedTableRow';

const Table = <T,>({ data, fields, onSort, onDragHeaderStart, isGrouped, depth = 0 }: TableProps<T>) => {

    return <>
        {
            isGrouped && data[0].groupedBy ? <>
                {data.map(row =>
                    <GroupedCell
                        colspan={fields.length + 1}
                        value={row.groupedBy?.value || ''}
                        depth={depth}
                        row={row}
                        fields={fields}
                    />
                )}
            </>
                :

                <table>
                    <thead>
                        <tr key={'table-headers'}>
                            {fields && fields.map((field) => (
                                <th
                                    draggable={field.groupable}
                                    onDragStart={(ev) => {
                                        if (onDragHeaderStart) {
                                            onDragHeaderStart(field.key as keyof T, ev);
                                        }
                                    }}
                                    key={String(field.key)}
                                >
                                    {field.headerText}
                                    {
                                        field.sortable &&
                                        (
                                            field.sorted === 'desc' ?
                                                <ArrowDropUpIcon onClick={() => {
                                                    if (onSort) {
                                                        onSort(field.key as keyof T, 'asc');
                                                    }
                                                }} />
                                                :
                                                <ArrowDropDownIcon
                                                    style={{ color: !field.sorted ? '#cdd1ce' : 'unset' }}
                                                    onClick={() => {
                                                        if (onSort) {
                                                            onSort(field.key as keyof T, 'asc');
                                                        }
                                                    }}
                                                />
                                        )
                                    }
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((row) => (
                            row.groupedData ?
                                <>
                                    <GroupedCell
                                        colspan={fields.length + 1}
                                        value={row.groupedBy?.value || ''}
                                        depth={depth}
                                        row={row}
                                        fields={fields}
                                    />
                                </>
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
                    </tbody>
                </table>
        }
    </>
};


export default Table;