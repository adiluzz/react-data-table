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
import { FC } from 'react';
import DataTable, { TableField } from "react-turbo-table";
import mockData from '../../react-turbo-table/tests/MOCK_DATA.json';

type MockData = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  ip_address: string;

}

const App: FC = () => {
  const mockTableFields:TableField<MockData>[] = [
    { key: "id", headerText: "ID", sortable: true, groupable: true },
    { key: "first_name", headerText: "First Name", sortable: true, groupable: true },
    { key: "last_name", headerText: "Last Name", sortable: true, groupable: true },
    { key: "email", headerText: "Email", sortable: true, groupable: true },
    { key: "gender", headerText: "Gender", sortable: true, groupable: true },
    { 
      key: "ip_address", 
      headerText: "IP Address", 
      sortable: true, 
      groupable: true,
      renderComponent:(row) => <div>{row.ip_address}</div>
    },
  ];


  return (
    <div className="App">
      <DataTable data={mockData as unknown as MockData[]} fields={mockTableFields} />
    </div>
  );
}

export default App;
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