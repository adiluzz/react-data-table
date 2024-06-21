import { useCallback, useEffect, useState } from "react";
import { defaultPageSizeOptions } from "../../../DataTable.const";
import { BaseRow, TableField, TableProps } from "../../../DataTable.interface";
import GroupedTableRow from '../../GroupedTableRow';
import Pagination from "../../Pagination";
import TableConditional from '../../TableConditional';
import { getTableContext } from "./Table.context";

const Table = <T,>({ data, fields, renderHeaders, depth = 0 }: TableProps<T>) => {
const TableContext = getTableContext<T>();
    const [tableData, setTableData] = useState<BaseRow<T>[]>(data);
    const [curData, setCurData] = useState<BaseRow<T>[]>();
    const [columns, setColumns] = useState<TableField<T>[]>(fields);


    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defaultPageSizeOptions[0]);

    // const curData = useMemo(() => {
    //     const start = page * pageSize;
    //     console.log('start is :', start);

    //     const end = start + pageSize;
    //     console.log('end is :', end);

    //     return tableData.slice(start, end);
    // }, [tableData, page, pageSize]);

    const setTableDataAction = useCallback((rows: BaseRow<T>[]) => {
        setTableData(rows);
        const start = page * pageSize;

        const end = start + pageSize;
        const paginatedData = rows.slice(start, end);
        setCurData(paginatedData);
    },[page, pageSize]);

    useEffect(()=>{
        setTableDataAction(data);
    },[data, setTableDataAction])

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
        <TableConditional
            renderHeaders={!!renderHeaders}
        >
            {curData && curData.map((row) => (
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
        <Pagination />
    </TableContext.Provider>
};


export default Table;