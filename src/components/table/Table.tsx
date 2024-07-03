import { useCallback, useEffect, useState } from "react";
import { defaultPageSizeOptions } from "../data_table/DataTable.const";
import { BaseRow, TableField, TableProps } from "../data_table/DataTable.interface";
import Pagination from "../pagination/Pagination";
import GroupedTableRow from "./GroupedTableRow";
import { TableDetail, TableOverflowContainer, TableRowWrapper } from "./Table.components";
import { getTableContext } from "./Table.context";
import TableConditional from "./TableConditional";


const Table = <T,>({ data, fields, renderHeaders, depth = 0 }: TableProps<T>) => {
    const TableContext = getTableContext<T>();
    const [tableData, setTableData] = useState<BaseRow<T>[]>(data);
    const [curData, setCurData] = useState<BaseRow<T>[]>();
    const [columns, setColumns] = useState<TableField<T>[]>(fields);


    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(defaultPageSizeOptions[0]);

    const setTableDataAction = useCallback((rows: BaseRow<T>[]) => {
        setTableData(rows);
        const start = page * pageSize;
        const end = start + pageSize;
        const paginatedData = rows.slice(start, end);
        setCurData(paginatedData);
    }, [page, pageSize]);

    useEffect(() => {
        setTableDataAction(data);
    }, [data, setTableDataAction])

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
        <TableOverflowContainer>
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
                        <TableRowWrapper key={row.id}>
                            {fields.map((field) => (
                                <TableDetail key={String(field.key)} >
                                    {field.renderComponent
                                        ? field.renderComponent(row)
                                        : row[field.key as never]}
                                </TableDetail>
                            ))}
                        </TableRowWrapper>
                ))}

            </TableConditional>
        </TableOverflowContainer>
        <Pagination<T> />
    </TableContext.Provider >
};


export default Table;