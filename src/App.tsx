import { useCallback, useEffect, useState } from 'react';
import './App.css';
import DataTable from './DataTable';
import { TableField } from './DataTable.interface';

type User = {
	id: string;
	name: string;
	username: string;
}

function App() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [users, setUsers] = useState<any[]>();
	const removeUserFromTable = (id: string) => {
		if (users) {
			setUsers(
				users.filter((user) => {
					return user?.id && user.id !== id;
				})
			);
		}
	};
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
			{users && <DataTable<User> data={users} fields={tableFields} />}
		</div>
	);
}

export default App
