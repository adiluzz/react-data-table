import { TableField } from "../../DataTable.interface";

export type MockData = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	gender: string;
	ip_address: string;

}


export 	const mockTableFields: TableField<MockData>[] = [
    { key: "id", headerText: "ID", sortable: true, groupable: true },
    { key: "first_name", headerText: "First Name", sortable: true, groupable: true },
    { key: "last_name", headerText: "Last Name", sortable: true, groupable: true },
    { key: "email", headerText: "Email", sortable: true, groupable: true },
    { key: "gender", headerText: "Gender", sortable: true, groupable: true },
    { key: "ip_address", headerText: "IP Address", sortable: true, groupable: true },

];