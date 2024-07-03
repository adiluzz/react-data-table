import './App.css';
import DataTable from './components/data_table/DataTable';
import { DataTableProps } from './components/data_table/DataTable.interface';


const App = <T,>({data, fields}:DataTableProps<T>) =>{

	return (
		<div className="TurboTableApp">
			{data && <DataTable<T> data={data} fields={fields} />}
		</div>
	);
}

export default App
