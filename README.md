# React Turbo Table

This table is fast, has grouping abilities and can work with up to 10 million rows with grouping.


## Installation

Run

```console
npm i react-turbo-table
```

## Usage

This is a simple usage via API.

```typescript
import { useCallback, useEffect, useState } from 'react';
import DataTable from '../DataTable';
import { TableField } from '../DataTable.interface';
import './App.css';

type User = {
    id: string;
    name: string;
    username: string;
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
            {users && <DataTable data={users} fields={tableFields} />}
        </div>
    );
}

export default App

```

There are more examples in the tests/ directory.


## Props

This table currently has 2 props:
1. Data - your data.
2. Fields - your fields. This where most of the configuration is made.

### Fields parameter

<code>key</code> - (string) A unique key for this column.
<code>headerText</code> - (string) The text shown in the table header.
<code>sortable</code> - (boolean) Indicates if this column can be sorted.
<code>groupable</code> - (boolean) Indicates if this column can be grouped.
<code>renderComponent</code> - (JSX.element) A component to render instead of the value. This function gets the row it this table detail.