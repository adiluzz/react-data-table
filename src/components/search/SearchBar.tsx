import ClearIcon from '@mui/icons-material/Clear';

import { FC, useState } from "react";
import { useDataTableContext } from "../data_table/DataTable.context";
import { debounce } from "../data_table/DataTable.utils";
import { SearchBarWrapper, SearchInput } from "./Search.components";


const SearchBar: FC = () => {
    const [focused, setFocused] = useState<boolean>(false);
    const ctx = useDataTableContext();
    const changeSearchTerm = (term: string) => {
        if (ctx?.setSearchTerm) {
            ctx?.setSearchTerm(term);
        }
    }
    const debouncedChangedSearchTerm = debounce(changeSearchTerm, 1000);
    return <SearchBarWrapper $focused={focused}>
        <SearchInput
            onChange={(ev) => {
                debouncedChangedSearchTerm(ev.target.value);
            }}
            placeholder="Search..."
            onFocus={() => {
                setFocused(true);
            }}
            onBlur={() => {
                setFocused(false);
            }}
            // value={ctx?.searchTerm}
        />
        {
            ctx?.searchTerm && ctx.searchTerm !== '' &&
            <ClearIcon
                className="clickable"
                onClick={() => {
                    changeSearchTerm('');
                }} />
        }
    </SearchBarWrapper>
};

export default SearchBar;