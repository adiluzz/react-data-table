import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from "@mui/material";
import { FC, useRef, useState, useMemo, useEffect } from "react";
import { debounce } from "../data_table/DataTable.utils";
import { SearchBarWrapper, SearchInput } from "./Search.components";

type SearchBarProps = {
    onChange(val: string): void;
    value?: string;
    debounceTime?: number;
    placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({ onChange, value = '', debounceTime = 1000, placeholder = 'Search...' }) => {
    const [focused, setFocused] = useState<boolean>(false);
    const [localValue, setLocalValue] = useState<string>(value);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const onChangeRef = useRef(onChange);
    
    // Sync local value with prop value when it changes externally (e.g., from localStorage)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);
    
    // Keep onChangeRef up to date with the latest onChange
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);
    
    // Memoize the debounced function to avoid recreating it on every render
    const debouncedChangedSearchTerm = useMemo(() => {
        return debounce((val: string) => {
            onChangeRef.current(val);
        }, debounceTime);
    }, [debounceTime]);
    
    // Cleanup: cancel pending debounced calls on unmount or when debounceTime changes
    useEffect(() => {
        return () => {
            debouncedChangedSearchTerm.cancel?.();
        };
    }, [debouncedChangedSearchTerm]);

    const inputChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = ev.target.value;
        // Update local state immediately so user sees what they're typing
        setLocalValue(newValue);
        
        if (debounceTime) {
            debouncedChangedSearchTerm(newValue);
        } else {
            onChange(newValue);
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
            value={localValue}
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
            localValue !== '' &&
            <IconButton
                size="small"
                onClick={() => {
                    setLocalValue('');
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