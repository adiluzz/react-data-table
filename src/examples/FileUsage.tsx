import mockData from '../../tests/MOCK_DATA.json';
import DataTable from '../DataTable';
import { TableField } from '../DataTable.interface';
import './App.css';

type MockData = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	gender: string;
	ip_address: string;

}

function App() {
	const mockTableFields: TableField<MockData>[] = [
		{ key: "id", headerText: "ID", sortable: true, groupable: true },
		{ key: "first_name", headerText: "First Name", sortable: true, groupable: true },
		{ key: "last_name", headerText: "Last Name", sortable: true, groupable: true },
		{ key: "email", headerText: "Email", sortable: true, groupable: true },
		{ key: "gender", headerText: "Gender", sortable: true, groupable: true },
		{ key: "ip_address", headerText: "IP Address", sortable: true, groupable: true },
	];


	return (
		<div className="App">
            <DataTable data={mockData as unknown as MockData[]} fields={mockTableFields} />
		</div>
	);
}

export default App
