# React Turbo Table

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A fast, feature-rich React table component with grouping, sorting, filtering, and pagination capabilities. Built with Material UI for a beautiful, modern interface.

This table is fast, has grouping abilities and can work with up to 10 million rows with grouping.


## Installation

Install the package with a single command. All required dependencies will be installed automatically:

```console
npm install react-turbo-table
```

**Note:** The following dependencies are automatically installed:
- `react` (>=16.8.0)
- `react-dom` (>=16.8.0)
- `@mui/material` (^5.0.0)
- `@mui/icons-material` (^5.0.0)
- `@emotion/react` (^11.0.0)
- `@emotion/styled` (^11.0.0)

## Setup

No additional installation steps needed. All dependencies are installed automatically.

### Step 2: Wrap Your App with ThemeProvider

**Important**: This component requires Material UI's `ThemeProvider`. Make sure to wrap your app with it:

```typescript
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## Import Options

You can import the component in several ways:

```typescript
// Option 1: Named import (Recommended)
import { DataTable, TableField } from 'react-turbo-table';

// Option 2: Named import (TurboTable alias)
import { TurboTable, TableField } from 'react-turbo-table';

// Option 3: Default import
import DataTable, { TableField } from 'react-turbo-table';
```

## Basic Usage Example

```typescript
import { useCallback, useEffect, useState } from 'react';
import { DataTable, TableField } from 'react-turbo-table';
import './App.css';

interface User {
    id: string;
    name: string;
    username: string;
    email: string;
}

function App() {
    const [users, setUsers] = useState<User[]>();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const tableFields: TableField<User>[] = [
        { key: "id", headerText: "ID", sortable: true, groupable: true },
        { key: "name", headerText: "Name", sortable: true, groupable: true },
        { key: "username", headerText: "Username", sortable: true, groupable: true },
        {
            renderComponent: (row: User) => {
                // ✅ Full type safety - TypeScript knows all properties exist
                return (
                    <div>Name: {row.name}. Username: {row.username}</div>
                );
            },
            headerText: "Custom",
            key: "custom",
        },
    ];

    const fetchUserData = useCallback(async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const users: User[] = await res.json();
        setUsers(users);
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    return (
        <div className="App">
            {users && (
                <DataTable
                    data={users}
                    fields={tableFields}
                    selectable={true}
                    onSelectionChange={(ids) => {
                        setSelectedIds(ids);
                        console.log('Selected IDs:', ids);
                    }}
                />
            )}
            {selectedIds.length > 0 && (
                <p>Selected {selectedIds.length} row(s)</p>
            )}
        </div>
    );
}

export default App;
```

## TypeScript Type Safety

The component provides full TypeScript type safety. When you use `renderComponent`, you get the exact type `T` you provided:

```typescript
import { useState } from 'react';
import { DataTable, TableField } from 'react-turbo-table';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
}

const fields: TableField<Product>[] = [
    {
        key: 'name',
        headerText: 'Product Name',
        sortable: true,
        width: 200, // Fixed width in pixels
        renderComponent: (row: Product) => {
            // ✅ TypeScript knows row.name, row.price, etc. all exist
            return <span>{row.name} - ${row.price}</span>;
        }
    },
    {
        key: 'category',
        headerText: 'Category',
        filterable: true,
        // No width specified - column will size to content
    },
    {
        key: 'price',
        headerText: 'Price',
        sortable: true,
        width: 150, // Fixed width in pixels
    },
];

function ProductTable() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    const products: Product[] = [
        { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
        { id: 2, name: 'Desk', price: 299, category: 'Furniture' },
    ];

    return (
        <>
            <DataTable
                data={products}
                fields={fields}
                selectable={true}
                onSelectionChange={(ids) => setSelectedIds(ids)}
            />
            {selectedIds.length > 0 && (
                <p>Selected {selectedIds.length} product(s)</p>
            )}
        </>
    );
}
```

There are more examples in the src/examples directory.


## Props

This table currently has 6 props:

1. <code>data</code> - your data.
2. <code>fields</code> - your fields. This where most of the configuration is made.
3. <code>selectable</code> - `boolean` (optional) - Enables row selection. When `true`, adds a checkbox column as the first column.
4. <code>onSelectionChange</code> - `(selectedIds: string[]) => void` (optional) - Callback function that is called whenever the selection changes. Receives an array of selected row IDs.
5. <code>localStorageKey</code> - `string` (optional) - If provided, table state (groupings, search, filters, selection, sort) is saved to and restored from localStorage under this key.
6. <code>defaultPageSize</code> - `number` (optional) - Default rows per page. Must be one of the table page size options (10, 25, 50, 100). If the value is not in this list, a console error is logged and the first option (10) is used; the table still renders.

### Row Selection

When `selectable` is set to `true`, the table will display a checkbox column as the first column. Users can:

- Select individual rows by clicking their checkboxes
- Select all rows using the checkbox in the header
- Select entire groups (when grouping is enabled) - selecting a group row will select all rows within that group, including nested groups

**Example with Selection:**

```typescript
import { useState } from 'react';
import { DataTable, TableField } from 'react-turbo-table';

interface User {
    id: string;
    name: string;
    email: string;
}

function App() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    const fields: TableField<User>[] = [
        { key: 'id', headerText: 'ID' },
        { key: 'name', headerText: 'Name' },
        { key: 'email', headerText: 'Email' },
    ];

    const users: User[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];

    return (
        <div>
            <DataTable
                data={users}
                fields={fields}
                selectable={true}
                onSelectionChange={(ids) => {
                    setSelectedIds(ids);
                    console.log('Selected IDs:', ids);
                }}
            />
            <p>Selected: {selectedIds.length} rows</p>
        </div>
    );
}
```

**Important Notes:**
- Each row must have a unique `id` property. If your data doesn't have an `id`, the component will automatically generate one based on the row index.
- When a grouped row is selected, all rows within that group (including nested groups) are automatically selected.
- The `onSelectionChange` callback receives an array of all selected row IDs, regardless of whether they were selected individually or as part of a group.

### Fields parameters

- <code>key</code> - `keyof T | string | number | symbol` - A unique key for this column. Can be a property of your data type or a custom string.
- <code>headerText</code> - `string` - The text shown in the table header.
- <code>sortable</code> - `boolean` (optional) - Indicates if this column can be sorted. Click the header to sort.
- <code>groupable</code> - `boolean` (optional) - Indicates if this column can be grouped. Drag the header to the grouping area to group by this column.
- <code>searchable</code> - `boolean` (optional) - Indicates if this column can be searched using the search bar.
- <code>filterable</code> - `boolean` (optional) - Indicates if this column can be filtered using the filter panel.
- <code>renderComponent</code> - `(row: T) => JSX.Element` (optional) - A function that receives the row data (type `T`) and returns a React element. Provides full TypeScript type safety. If not provided, the value of `row[key]` will be displayed.
- <code>width</code> - `number` (optional) - Column width in pixels. If not provided, the column width will be automatically determined based on its content.
- <code>sorted</code> - `'asc' | 'desc'` (optional, internal) - Current sort direction. Managed internally by the component.

## Troubleshooting

### Error: "Cannot read properties of undefined (reading 'ReactCurrentDispatcher')"

This error occurs when React is not properly available. Make sure:

1. **React is installed** in your project:
   ```console
   npm install react react-dom
   ```

2. **React is not bundled** - The package expects React to be provided by your application, not bundled internally.

3. **Check React version compatibility** - The package supports React >=16.8.0, including React 19.

4. **Verify Material UI is installed**:
   ```console
   npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
   ```

### Import Errors

If you get import errors, make sure you're using one of the supported import styles:

```typescript
// ✅ Correct - Default import
import DataTable, { TableField } from 'react-turbo-table';

// ✅ Correct - Named import
import { DataTable, TableField } from 'react-turbo-table';

// ✅ Correct - TurboTable alias
import { TurboTable, TableField } from 'react-turbo-table';
```

### TypeScript Type Errors

If you're getting type errors with `renderComponent`, make sure you're using the type `T` directly:

```typescript
// ✅ Correct - Full type safety
renderComponent: (row: User) => {
    return <span>{row.name}</span>; // TypeScript knows 'name' exists
}

// ❌ Incorrect - Don't use 'any'
renderComponent: (row: any) => {
    return <span>{row.name}</span>; // Loses type safety
}
```

## Complete Example

Here's a complete working example:

```typescript
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DataTable, TableField } from 'react-turbo-table';
import { useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

const theme = createTheme();

function App() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    const users: User[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];

    const fields: TableField<User>[] = [
        { key: 'id', headerText: 'ID', sortable: true },
        { key: 'name', headerText: 'Name', sortable: true, groupable: true },
        { key: 'email', headerText: 'Email', sortable: true },
    ];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <DataTable
                data={users}
                fields={fields}
                selectable={true}
                onSelectionChange={(ids) => setSelectedIds(ids)}
            />
            {selectedIds.length > 0 && (
                <p>Selected {selectedIds.length} row(s)</p>
            )}
        </ThemeProvider>
    );
}

export default App;
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.