import { TableField } from "../../components/data_table/DataTable.interface";

type User = {
	id: string;
	name: string;
	username: string;
}

export 	const tableFields: TableField<User>[] = [
    { key: "id", headerText: "ID", sortable: true, groupable: true },
    { key: "name", headerText: "Name", sortable: true, groupable: true },
    { key: "username", headerText: "Username", sortable: true, groupable: true },
    {
        renderComponent: (row) => {
            return (
                <button
                    onClick={() => {
                        if (row.id) {
                            console.log(row.id);
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