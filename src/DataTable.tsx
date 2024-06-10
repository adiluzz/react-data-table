import ClearIcon from '@mui/icons-material/Clear';
import { useCallback, useEffect, useMemo, useState } from "react";
import { BaseRow, DataTableProps, Grouping, SortDirection, TableField } from './DataTable.interface';
import { groupData } from './DataTable.utils';
import Table from './Table';



function hasGroupableFields(fields?: TableField<unknown>[]): boolean {
	return !!fields?.find(field => field.groupable);
}

const DataTable = <T,>({ data, fields }: DataTableProps<T>) => {
	const [tableData, setTableData] = useState<typeof data>();
	const [columns, setColumns] = useState<TableField<T>[]>();
	const [tableGroupings, setTableGroupings] = useState<Grouping<T>[]>();
	const tableHasGroupableFields = useMemo(() => hasGroupableFields(fields as never[]), [fields]);
	const sortData = (field: keyof T, direction: SortDirection) => {
		setTableData((table) => table?.sort((a, b) => {
			let ret;
			if (!!a[field] < !!b[field]) { ret = -1; }
			else if (!!a[field] > !!b[field]) { ret = 1; }
			else {
				ret = 0;
			}
			return direction === 'asc' ? ret : -ret;
		}));
		setColumns(cols => cols?.map((col) => {
			col.sorted = col.key === field ? direction : undefined;
			return col;
		}));
	};


	const addGroupings = (field: Grouping<T>) => {
		setTableGroupings((groups) => {
			if (!groups) {
				const returnValue = [field];
				return returnValue;
			} else {
				const returnValue = [...groups];
				returnValue.push(field);
				return returnValue;
			}
		});
	};

	const groupTableData = useCallback((data: BaseRow<T>[]) => {
		if (tableGroupings && tableGroupings.length > 0) {
			setTableData(groupData(data, tableGroupings));
		} else {
			setTableData(data);
		}
	}, [tableGroupings]);


	const removeFromGroupings = (field: string) => {
		setTableGroupings(groups => {
			const foundGroup = groups?.findIndex(val => val === field);
			const newGroups = groups ? [...groups] : []
			if (foundGroup || foundGroup === 0) {
				newGroups.splice(foundGroup, 1);
			}
			return newGroups;
		})
	};

	useEffect(() => {
		setColumns(fields);
		groupTableData(data);
	}, [data, fields, groupTableData, tableGroupings])
	return (
		<>
			{tableHasGroupableFields &&
				<div
					style={{
						height: '50px',
						width: '100%'
					}}
					id='grouping-wrapper'
					onDragOver={(ev => ev.preventDefault())}
					onDrop={ev => {
						ev.preventDefault();
						const data = ev.dataTransfer.getData("text");
						addGroupings(data as keyof BaseRow<T>);
					}}
					key={`grouping-wrapper-$`}
				>
					{
						tableGroupings?.map(field =>
							<div style={{ display: 'inline-block' }} key={String(field)}>
								{String(field)}
								<ClearIcon onClick={() => {
									removeFromGroupings(String(field));
								}} />
							</div>
						)
					}
				</div>
			}
			{
				tableData && columns &&
				<Table
					data={tableData}
					fields={columns}
					onSort={(col, direction) => sortData(col, direction)}
					onDragHeaderStart={(col, ev) => {
						ev.dataTransfer.setData("text", col as string);
					}}
				/>
			}
		</>
	);
};
export default DataTable;
