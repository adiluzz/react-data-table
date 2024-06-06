import { useCallback, useEffect, useState } from 'react';
import './App.css'
import Table, { TableField } from './Table';

function App() {
	const [users, setUsers] = useState<any[]>();
	const removeUserFromTable = (id: string) => {
		if (users) {
			setUsers(
				users.filter((user) => {
					return user.id !== id;
				})
			);
		}
	};
	const tableFields: TableField[] = [
		{ key: "id", headerText: "ID" },
		{ key: "name", headerText: "Name", sortable: true, groupable: true },
		{ key: "username", headerText: "Username", sortable: true, groupable: true },
		{
			renderComponent: (row: any) => {
				return (
					<button
						onClick={() => {
							removeUserFromTable(row.id);
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
		const users: any[] = await res.json();
		const duplicatedUsers = [...users, ...users.map((user, i) => {
			return { ...user, id: 11 + i }
		})]
		console.log(duplicatedUsers);
		
		setUsers(duplicatedUsers);
	}, []);

	useEffect(() => {
		fetchUserData();
	}, []);

	return (
		<div className="App">
			{users && <Table data={users} fields={tableFields} />}
		</div>
	);
}

export default App
