import { FC, useEffect, useMemo, useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { SortDirection } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

export type TableField = {
	key: string;
	renderComponent?: (value: string) => JSX.Element;
	headerText: string;
	sortable?: boolean;
	sorted?: SortDirection;
	groupable?: boolean;
};

type TableProps = {
	data: any[];
	fields: TableField[];
	groupings?: string[];
};

function hasGroupableFields(fields?: TableField[]): boolean {
	return !!fields?.find(field => field.groupable);
}

const Table: FC<TableProps> = ({ data, fields, groupings }) => {
	const [tableData, setTableData] = useState<any[]>();
	const [columns, setColumns] = useState<TableField[]>();
	const [tableGroupings, setTableGroupings] = useState<string[]>();
	const tableHasGroupableFields = useMemo(() => hasGroupableFields(fields), [fields]);
	const sortData = (field: string, direction: SortDirection) => {
		setTableData((table) => table?.sort((a, b) => {
			let ret;
			if (a[field] < b[field]) { ret = -1; }
			else if (a[field] > b[field]) { ret = 1; }
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
	

	const addGroupings = (field: string) => {
		setTableGroupings(groups => {
			return !groups ? [field] : [...groups, field]
		});
		let dataByKey = tableData?.reduce((prev, cur) => {
			if (!prev[cur[field]]) {
				prev[cur[field]] = [cur];
			} else {
				prev[cur[field]].push(cur);
			}
			return prev;
		}, {});
		const newTableData = [];
		for (const key in dataByKey) {
			if (Object.prototype.hasOwnProperty.call(dataByKey, key)) {
				const element = dataByKey[key];
				newTableData.push({
					groupdBy: {
						groupField: field,
						value: key,
					},
					groupedData: element
				})
			}
		}
		setTableData(newTableData);
	};

	const removeFromGroupings = (field: string) => {
		setTableGroupings(groups => {
			const foundGroup = groups?.findIndex(val => val === field);
			if (foundGroup || foundGroup === 0) {
				console.log(foundGroup);
				groups?.splice(foundGroup, 1);
			}
			return groups;
		})
	}

	useEffect(() => {
		setTableData(data);
		setColumns(fields);
	}, [data, columns])
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
						var data = ev.dataTransfer.getData("text");
						addGroupings(data);
					}}
				>
					{
						groupings?.map(field =>
							<div style={{ display: 'inline-block' }} key={field}>
								{field}
								<ClearIcon onClick={() => {
									removeFromGroupings(field);
								}} />
							</div>
						)
					}
				</div>
			}
			<table>
				<thead>
					<tr>
						{columns && columns.map((field) => (
							<th
								draggable={field.groupable && !groupings?.includes(field.key)}
								onDragStart={(ev) => {
									ev.dataTransfer.setData("text", field.key);
								}}
								key={field.key}
							>
								{field.headerText}
								{
									field.sortable &&
									(
										field.sorted === 'desc' ?
											<ArrowDropUpIcon onClick={() => {
												sortData(field.key, 'asc');
											}} />
											:
											<ArrowDropDownIcon
												style={{ color: !field.sorted ? '#cdd1ce' : 'unset' }}
												onClick={() => {
													sortData(field.key, 'desc');
												}}
											/>
									)
								}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{tableData && tableData.map((row) => (
						<tr key={row.id}>
							{
								row.groupedData &&
								<>
									<tr><td>{row.groupdBy.value}</td></tr>
										<Table
											data={row.groupedData}
											fields={fields}
											groupings={tableGroupings?.splice(0,1)}
										/>
								</>
							}
							{fields.map((field) => (
								<td key={field.key}>
									{field.renderComponent
										? field.renderComponent(row)
										: row[field.key]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};
export default Table;
