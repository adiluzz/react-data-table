import ClearIcon from '@mui/icons-material/Clear';
import { FC, useRef, useState } from "react";
import { debounce } from "../data_table/DataTable.utils";
import { SearchBarWrapper, SearchInput } from "./Search.components";

type SearchBarProps = {
    onChange(val: string): void;
    debounceTime?: number;
    placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({ onChange, debounceTime = 1000, placeholder = 'Search...' }) => {
    const [focused, setFocused] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const debouncedChangedSearchTerm = debounce(onChange, debounceTime);

    const inputChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (debounceTime) {
            debouncedChangedSearchTerm(ev.target.value);
        } else {
            onChange(ev.target.value);
        }
    }
    return <SearchBarWrapper $focused={focused}>
        <SearchInput
            onChange={inputChanged}
            placeholder={placeholder}
            onFocus={() => {
                setFocused(true);
            }}
            onBlur={() => {
                setFocused(false);
            }}
            ref={searchInputRef}
        />
        {
            searchInputRef?.current?.value !== '' &&
            <ClearIcon
                className="clickable"
                onClick={() => {
                    if (searchInputRef.current) {
                        searchInputRef.current.value = '';
                    }
                    onChange('');
                }} />
        }
    </SearchBarWrapper>
};

export default SearchBar;