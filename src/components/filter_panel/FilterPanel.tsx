import { FC, useCallback, useEffect, useMemo, useState } from "react";
import DeletableOption from "../common/DeletableOption";
import { useDataTableContext } from "../data_table/DataTable.context";
import SearchBar from "../search/SearchBar";
import FilterGroup from "./FilterGroup";
import { FilterGroupsContainer, FilterSelectContainer, SelectFiltersButton } from "./FilterPanel.components";
import { avoidCloseFiltersMenu } from "./FilterPanel.const";
import { Filter } from "./FilterPanel.interface";



const FilterPanel: FC = () => {
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const [searchFilter, setSearchFilter] = useState<string>('');
    const ctx = useDataTableContext();

    const handleClick = useCallback((ev: MouseEvent) => {
        if (filtersOpen) {
            const tar = ev.target as HTMLDivElement;
            const avoidClick = tar?.className?.includes ? tar.className.includes(avoidCloseFiltersMenu) : false;
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


    return <FilterGroupsContainer>
        <div>
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
            <FilterSelectContainer $open={filtersOpen} $time='0.2s'>
                {
                    filteredData?.map(filter => {
                        return <FilterGroup
                            {...filter}
                            key={filter.property}
                            headerText={ctx?.getHeader(filter.property)?.headerText}
                            onFilterClicked={(clickedFilter) => {
                                ctx?.setSelectedFilters(prev => {
                                    if (prev) {
                                        return prev.concat([clickedFilter]);
                                    } else {
                                        return [clickedFilter];
                                    }
                                })
                            }}
                        />
                    })
                }
            </FilterSelectContainer>
        </div>
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