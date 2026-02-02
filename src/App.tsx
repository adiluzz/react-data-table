import './App.css';
import DataTable from './components/data_table/DataTable';
import { DataTableProps } from './components/data_table/DataTable.interface';


const App = <T,>({ data, fields, selectable, onSelectionChange, localStorageKey }: DataTableProps<T>) => {
	return (
		<div className="TurboTableApp">
			{data && (
				<DataTable<T>
					data={data}
					fields={fields}
					selectable={selectable}
					onSelectionChange={onSelectionChange}
					localStorageKey={localStorageKey}
				/>
			)}
		</div>
	);
}

export default App
