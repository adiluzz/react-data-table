import { useCallback, useEffect, useState } from 'react';
// import mockData from '../tests/MOCK_DATA_DUPLICATED_ROWS_1000.json';
// import mockData from '../tests/MOCK_DATA_DUPLICATED_ROWS_200.json';
import mockData from '../tests/MOCK_DATA.json';
import './App.css';
import DataTable from './DataTable';
import { TableField } from './DataTable.interface';

type User = {
	id: string;
	name: string;
	username: string;
}

type MockData = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	gender: string;
	ip_address: string;

}

function App() {
	const [users, setUsers] = useState<User[]>();
	const removeUserFromTable = (id: string) => {
		if (users) {
			setUsers(
				users.filter((user) => {
					return user?.id && user.id !== id;
				})
			);
		}
	};
	const mockTableFields: TableField<MockData>[] = [
		{ key: "id", headerText: "ID", sortable: true, groupable: true },
		{ key: "first_name", headerText: "First Name", sortable: true, groupable: true },
		{ key: "last_name", headerText: "Last Name", sortable: true, groupable: true },
		{ key: "email", headerText: "Email", sortable: true, groupable: true },
		{ key: "gender", headerText: "Gender", sortable: true, groupable: true },
		{ key: "ip_address", headerText: "IP Address", sortable: true, groupable: true },

	];
	const tableFields: TableField<User>[] = [
		{ key: "id", headerText: "ID", sortable: true, groupable: true },
		{ key: "name", headerText: "Name", sortable: true, groupable: true },
		{ key: "username", headerText: "Username", sortable: true, groupable: true },
		{
			renderComponent: (row) => {
				return (
					<button
						onClick={() => {
							if (row.id) {
								removeUserFromTable(row.id);
							}
						}}
					>
						Delete {row.name}
					</button>
				);
			},
			headerText: "Delete",
			key: "delete",
		},
	];

	const fetchUserData = useCallback(async () => {
		const res = await fetch("https://jsonplaceholder.typicode.com/users");
		const users: User[] = await res.json();
		const duplicatedUsers: User[] = [...users, ...users.map((user, i) => {
			return { ...user, id: String(11 + i) }
		})]

		setUsers(duplicatedUsers);
	}, []);


	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	return (
		<div className="App">
			{mockData && <DataTable data={mockData as unknown as MockData[]} fields={mockTableFields} />}
			{/* {users && <DataTable data={users} fields={tableFields} />} */}
		</div>
	);
}

export default App
