import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from "@mui/material";
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
        <SearchIcon
            sx={{
                color: 'text.secondary',
                fontSize: '20px',
                mr: 1,
            }}
        />
        <SearchInput
            onChange={inputChanged}
            placeholder={placeholder}
            onFocus={() => {
                setFocused(true);
            }}
            onBlur={() => {
                setFocused(false);
            }}
            inputRef={searchInputRef}
        />
        {
            searchInputRef?.current?.value !== '' &&
            <IconButton
                size="small"
                onClick={() => {
                    if (searchInputRef.current) {
                        searchInputRef.current.value = '';
                    }
                    onChange('');
                }}
                sx={{
                    padding: 0.5,
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    },
                }}
            >
                <ClearIcon
                    sx={{
                        fontSize: '18px',
                        color: 'text.secondary',
                    }}
                />
            </IconButton>
        }
    </SearchBarWrapper>
};

export default SearchBar;