import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SortIcon from '@mui/icons-material/Sort';
import { TableRow } from '@mui/material';
import { FC } from "react";
import { SortDirection } from '../data_table/DataTable.interface';
import { TableHeaderIconWrapper, TableHeaderTextWrapper, TableHeaderWrapper } from './Table.components';
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

    return <TableRow key={'table-headers'}>
        {ctx?.columns && ctx?.columns.map((field) => (
            <TableHeaderWrapper
                draggable={field.groupable}
                onDragStart={(ev) => {
                    return ev.dataTransfer.setData("text", field.key as string);
                }}
                key={String(field.key)}
                $draggable={!!field.groupable}
            >
                <TableHeaderTextWrapper>
                    {field.headerText}
                </TableHeaderTextWrapper>
                {
                    field.sortable &&
                    <TableHeaderIconWrapper>
                        {(
                            field.sorted === 'desc' ?
                                <ArrowDropUpIcon
                                    sx={{
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        color: 'primary.main',
                                        transition: 'color 0.2s ease-in-out',
                                        '&:hover': {
                                            color: 'primary.dark',
                                        },
                                    }}
                                    onClick={() => {
                                        sortData(field.key as keyof T, 'asc');
                                    }}
                                />
                                : field.sorted === 'asc' ?
                                    <ArrowDropDownIcon
                                        sx={{
                                            cursor: 'pointer',
                                            fontSize: '20px',
                                            color: 'primary.main',
                                            transition: 'color 0.2s ease-in-out',
                                            '&:hover': {
                                                color: 'primary.dark',
                                            },
                                        }}
                                        onClick={() => {
                                            sortData(field.key as keyof T, 'desc');
                                        }}
                                    />
                                    :
                                    <SortIcon
                                        sx={{
                                            cursor: 'pointer',
                                            fontSize: '20px',
                                            color: 'action.disabled',
                                            transition: 'color 0.2s ease-in-out',
                                            '&:hover': {
                                                color: 'action.active',
                                            },
                                        }}
                                        onClick={() => {
                                            sortData(field.key as keyof T, 'asc');
                                        }}
                                    />
                        )}
                    </TableHeaderIconWrapper>
                }
            </TableHeaderWrapper>
        ))}
    </TableRow>
}

export default TableHeaders;