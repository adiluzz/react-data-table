import './App.css';
import DataTable from './DataTable';
import { DataTableProps } from './DataTable.interface';


const App = <T,>({data, fields}:DataTableProps<T>) =>{

	return (
		<div className="App">
			{data && <DataTable<T> data={data} fields={fields} />}
		</div>
	);
}

export default App
