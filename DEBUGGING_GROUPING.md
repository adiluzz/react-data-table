# Debugging Grouping Issues

## Problem: `[object Object]` appears when grouping by object fields

When you group by a field that contains an object (not a primitive value), you might see `[object Object]` displayed instead of a meaningful value.

### What's happening:

1. **Grouping Process**: When you group by a field containing an object, the `getGroupKey` function in `DataTable.utils.ts` converts the object to a JSON string using `JSON.stringify()`.

2. **Display Issue**: The JSON string is stored as the grouped value, but when displayed, if the object doesn't have common display properties (like `name`, `title`, `label`), it might show as `[object Object]`.

### How to Debug:

1. **Check your data structure**:
   ```typescript
   // Example: If your Store field is an object
   interface MyData {
     store: {
       id: number;
       name: string;
       address: string;
     };
   }
   ```

2. **Add console logging** (temporary, for debugging):
   - Open `src/components/table/Table.tsx`
   - Find the grouping display logic (around line 58-100)
   - Add: `console.log('Grouped value:', displayValue, 'Parsed:', parsed);`

3. **Check what properties your object has**:
   ```typescript
   // In your component where you use DataTable
   console.log('Sample store object:', data[0]?.store);
   ```

### Solutions:

#### Option 1: Use a primitive field for grouping (Recommended)
If possible, group by a primitive field instead:
```typescript
// Instead of grouping by the entire store object
// Group by store.name or store.id
const fields: TableField<MyData>[] = [
  {
    key: 'store',
    headerText: 'Store',
    groupable: true,
    // Use renderComponent to display the store name
    renderComponent: (row) => <span>{row.store.name}</span>
  }
];
```

#### Option 2: Add a computed field
Create a computed field that extracts the display value:
```typescript
const fields: TableField<MyData>[] = [
  {
    key: 'storeName', // This doesn't exist in your data
    headerText: 'Store',
    groupable: true,
    renderComponent: (row) => <span>{row.store.name}</span>
  }
];

// Transform your data to include the computed field
const transformedData = data.map(row => ({
  ...row,
  storeName: row.store.name
}));
```

#### Option 3: Use renderComponent for the grouped field
The table will try to extract common properties (`name`, `title`, `label`, `displayName`, `id`, `value`, `text`). If your object has one of these, it should work automatically.

### Current Fix:

The code now:
1. Parses JSON strings from grouped objects
2. Tries common display properties: `name`, `title`, `label`, `displayName`, `display`, `id`, `value`, `text`, `description`
3. Falls back to the first meaningful string property
4. As a last resort, uses the first non-object property value

### Testing:

To test if the fix works:
1. Group by a field that contains an object
2. Check if a meaningful value is displayed instead of `[object Object]`
3. If it still shows `[object Object]`, check the browser console for any errors
4. Verify your object structure matches one of the common patterns
