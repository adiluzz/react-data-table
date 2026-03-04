import { Box, Paper } from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import DeletableOption from "../common/DeletableOption";
import { useDataTableContext } from "../data_table/DataTable.context";
import SearchBar from "../search/SearchBar";
import FilterGroup from "./FilterGroup";
import { FilterGroupsContainer, FilterSelectContainer, SelectFiltersButton } from "./FilterPanel.components";
import { avoidCloseFiltersMenu } from "./FilterPanel.const";
import { Filter, FilterResult } from "./FilterPanel.interface";

type FlatFilterOption = {
    groupIndex: number;
    optionIndex: number;
    property: string;
    value: string;
};

const FilterPanel: FC = () => {
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const filterContainerRef = useRef<HTMLDivElement>(null);
    const ctx = useDataTableContext();

    const handleClick = useCallback((ev: MouseEvent) => {
        if (filtersOpen) {
            const el = ev.target as Element;
            // Don't close when clicking inside the dropdown (option click must run first)
            const insideDropdown = !!el?.closest?.('[data-filter-dropdown]');
            const avoidClick = insideDropdown || (el?.className?.includes?.(avoidCloseFiltersMenu) ?? false);
            setFiltersOpen(avoidClick);
        }
    }, [filtersOpen]);

    useEffect(() => {
        document.addEventListener('click', handleClick, true);
        return () => {
            document.removeEventListener('click', handleClick, true);
        }
    }, [handleClick]);

    const filteredData = useMemo(() => {
        if (ctx?.filterPanelState) {
            const newFilters: Filter[] = [];
            for (let i = 0; i < ctx.filterPanelState.length; i++) {
                const filter = ctx.filterPanelState[i];
                const addedFilter: Filter = {
                    property: filter.property,
                    values: []
                }
                for (let j = 0; j < filter.values.length; j++) {
                    const filterValue = filter.values[j];
                    if (filterValue.value.toLowerCase().includes(searchFilter.toLowerCase())) {
                        addedFilter.values.push(filterValue);
                    }
                }
                if (addedFilter.values.length > 0) {
                    newFilters.push(addedFilter);
                }
            }
            return newFilters
        }
    }, [ctx?.filterPanelState, searchFilter]);

    // Create a flat list of all visible filter options for keyboard navigation
    const flatFilterOptions = useMemo<FlatFilterOption[]>(() => {
        if (!filteredData) return [];
        const flat: FlatFilterOption[] = [];
        filteredData.forEach((filter, groupIndex) => {
            filter.values.forEach((option, optionIndex) => {
                flat.push({
                    groupIndex,
                    optionIndex,
                    property: filter.property,
                    value: option.value,
                });
            });
        });
        return flat;
    }, [filteredData]);

    // Reset focused index when filters change or panel opens/closes
    useEffect(() => {
        if (filtersOpen && flatFilterOptions.length > 0) {
            setFocusedIndex(0);
        } else if (!filtersOpen) {
            setFocusedIndex(-1);
        }
    }, [filtersOpen, flatFilterOptions.length]);

    // Scroll the focused option into view
    const scrollToFocusedOption = useCallback((index: number) => {
        if (!filterContainerRef.current || index < 0 || index >= flatFilterOptions.length) return;
        
        const option = flatFilterOptions[index];
        const filterGroupElements = filterContainerRef.current.querySelectorAll('[data-filter-group]');
        if (filterGroupElements[option.groupIndex]) {
            const groupElement = filterGroupElements[option.groupIndex] as HTMLElement;
            const optionElements = groupElement.querySelectorAll('[data-filter-option]');
            if (optionElements[option.optionIndex]) {
                const optionElement = optionElements[option.optionIndex] as HTMLElement;
                optionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [flatFilterOptions]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!filtersOpen || flatFilterOptions.length === 0) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setFocusedIndex((prev) => {
                    const next = prev < flatFilterOptions.length - 1 ? prev + 1 : 0;
                    setTimeout(() => scrollToFocusedOption(next), 0);
                    return next;
                });
                break;
            case 'ArrowUp':
                event.preventDefault();
                setFocusedIndex((prev) => {
                    const next = prev > 0 ? prev - 1 : flatFilterOptions.length - 1;
                    setTimeout(() => scrollToFocusedOption(next), 0);
                    return next;
                });
                break;
            case 'Enter':
                event.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < flatFilterOptions.length) {
                    const option = flatFilterOptions[focusedIndex];
                    const clickedFilter: FilterResult = {
                        property: option.property,
                        value: option.value,
                    };
                    ctx?.setSelectedFilters(prev => {
                        if (prev) {
                            return prev.concat([clickedFilter]);
                        } else {
                            return [clickedFilter];
                        }
                    });
                }
                break;
            case 'Escape':
                event.preventDefault();
                setFiltersOpen(false);
                break;
        }
    }, [filtersOpen, flatFilterOptions, focusedIndex, ctx, scrollToFocusedOption]);

    useEffect(() => {
        if (filtersOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [filtersOpen, handleKeyDown]);


    return <FilterGroupsContainer>
        <Box sx={{ position: 'relative' }}>
            <SelectFiltersButton
                className="clickable"
                onClick={() => {
                    setFiltersOpen(prev => {
                        return !prev;
                    });
                }}
            >
                <SearchBar
                    onChange={val => setSearchFilter(val)}
                    debounceTime={100}
                    placeholder="Add Filters..."
                />
            </SelectFiltersButton>
            {filtersOpen && (
                <Paper
                    data-filter-dropdown
                    elevation={4}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        mt: 1,
                        zIndex: 1300,
                        overflow: 'hidden',
                    }}
                >
                    <FilterSelectContainer 
                        ref={filterContainerRef}
                        $open={filtersOpen} 
                        $time='0.2s'
                        tabIndex={-1}
                    >
                        {
                            filteredData?.map((filter, groupIndex) => {
                                return <FilterGroup
                                    {...filter}
                                    key={filter.property}
                                    groupIndex={groupIndex}
                                    headerText={ctx?.getHeader(filter.property)?.headerText}
                                    focusedIndex={focusedIndex >= 0 && flatFilterOptions[focusedIndex]?.groupIndex === groupIndex 
                                        ? flatFilterOptions[focusedIndex]?.optionIndex 
                                        : -1}
                                    onFilterClicked={(clickedFilter) => {
                                        ctx?.setSelectedFilters(prev => {
                                            if (prev) {
                                                return prev.concat([clickedFilter]);
                                            } else {
                                                return [clickedFilter];
                                            }
                                        });
                                        setFiltersOpen(false);
                                    }}
                                />
                            })
                        }
                    </FilterSelectContainer>
                </Paper>
            )}
        </Box>
        {
            ctx?.selectedFilters?.map(oneFilter => {
                return <DeletableOption
                    key={`${oneFilter.property}-${oneFilter.value}`}
                    title={`${ctx.getHeader(oneFilter.property)?.headerText} : ${oneFilter.value}`}
                    onDelete={() => {
                        ctx.setSelectedFilters(prev => prev?.filter((val) => val.property !== oneFilter.property))
                    }} />
            })
        }
    </FilterGroupsContainer>
};

export default FilterPanel;