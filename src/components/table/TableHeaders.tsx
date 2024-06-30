import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SortIcon from '@mui/icons-material/Sort';
import { FC } from "react";
import { SortDirection } from '../../DataTable.interface';
import { TableHeaderWrapper } from './Table.components';
import { useTableContext } from './Table.context';


const TableHeaders: FC = <T,>() => {
    const ctx = useTableContext<T>();
    const sortData = (field: keyof T, direction: SortDirection) => {
        const sortedData = ctx?.tableData?.sort((a, b) => {
            let ret;
            const aField = a[field];
            const bField = b[field];
            if (aField && bField) {
                ret = aField < bField ? -1 : aField > bField ? 1 : 0;
            }
            else {
                ret = aField ? 1 : bField ? -1 : 0;
            }
            return direction === 'asc' ? ret : -ret;
        });

        if (ctx?.setTableData && sortedData) {
            ctx?.setTableData(sortedData);
        }
        ctx?.setColumns && ctx?.setColumns(cols => cols?.map((col) => {
            col.sorted = col.key === field ? direction : undefined;
            return col;
        }));
    };

    return <tr key={'table-headers'}>
        {ctx?.columns && ctx?.columns.map((field) => (
            <TableHeaderWrapper
                draggable={field.groupable}
                onDragStart={(ev) => {
                    return ev.dataTransfer.setData("text", field.key as string);
                }}
                key={String(field.key)}
            >
                {field.headerText}
                {
                    field.sortable &&
                    (
                        field.sorted === 'desc' ?
                            <ArrowDropUpIcon onClick={() => {
                                sortData(field.key as keyof T, 'asc');
                            }} />
                            : field.sorted === 'asc' ?
                                <ArrowDropDownIcon
                                    style={{ color: !field.sorted ? '#cdd1ce' : 'unset' }}
                                    onClick={() => {
                                        sortData(field.key as keyof T, 'desc');
                                    }}
                                />
                                :
                                <SortIcon
                                    onClick={() => {
                                        sortData(field.key as keyof T, 'asc');
                                    }}
                                />
                    )
                }
            </TableHeaderWrapper>
        ))}
    </tr>
}

export default TableHeaders;