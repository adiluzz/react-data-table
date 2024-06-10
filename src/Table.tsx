import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { TableProps } from "./DataTable.interface";

const Table = <T,>({ data, fields, onSort, onDragHeaderStart }: TableProps<T>) => {
    return <table>
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
                                        if(onSort) {
                                            onSort(field.key as keyof T, 'asc');
                                        }
                                    }} />
                                    :
                                    <ArrowDropDownIcon
                                        style={{ color: !field.sorted ? '#cdd1ce' : 'unset' }}
                                        onClick={() => {
                                            if(onSort) {
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
                <tr key={row.id}>
                    {
                        row.groupedData ?
                            <td colSpan={fields.length + 1}>
                                <div>{row.groupedBy?.value}</div>
                                <Table
                                    data={row.groupedData}
                                    fields={fields}
                                />
                            </td>
                            :
                            fields.map((field) => (
                                <td key={String(field.key)}>
                                    {field.renderComponent
                                        ? field.renderComponent(row)
                                        : row[field.key as never]}
                                </td>
                            ))
                    }
                </tr>
            ))}
        </tbody>
    </table>

};


export default Table;