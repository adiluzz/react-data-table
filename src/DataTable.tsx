import { useCallback, useEffect, useMemo, useState } from "react";
import DataTableContext from './DataTable.context';
import { BaseRow, DataTableProps, Grouping, TableField } from './DataTable.interface';
import { groupData } from './DataTable.utils';
import GroupingPanel from './components/GroupingPanel';
import Table from './components/modules/table/Table';



function hasGroupableFields<T>(fields?: TableField<T>[]): boolean {
	return !!fields?.find(field => field.groupable);
}

const DataTable = <T,>({ data, fields }: DataTableProps<T>) => {
	const [tableData, setTableData] = useState<BaseRow<T>[]>();
	const [columns, setColumns] = useState<TableField<T>[]>();
	const [tableGroupings, setTableGroupings] = useState<Grouping<T>[]>();
	const tableHasGroupableFields = useMemo(() => hasGroupableFields<T>(fields), [fields]);

	const groupTableData = useCallback((data: BaseRow<T>[]) => {
		if (tableGroupings && tableGroupings.length > 0) {
			setTableData(groupData(data, tableGroupings));
		} else {
			setTableData(data);
		}
	}, [tableGroupings]);

	useEffect(() => {
		setColumns(fields);
		groupTableData(data);
	}, [data, fields, groupTableData, tableGroupings])
	return (
		<DataTableContext.Provider
			value={{
				tableData,
				setTableData,
				tableGroupings,
				setTableGroupings,
				columns,
				setColumns,
			}}
		>
			{tableHasGroupableFields && <GroupingPanel />}
			{
				tableData && columns &&
				<Table<T>
					data={tableData}
					fields={columns}
					renderHeaders={true}
				/>
			}
		</DataTableContext.Provider>
	);
};
export default DataTable;
