import { FC, useState } from "react";
import ConditionalArrow from "../common/ConditionalArrow";
import DeletableOption from "../common/DeletableOption";
import { useDataTableContext } from "../data_table/DataTable.context";
import FilterGroup from "./FilterGroup";
import { FilterGroupsContainer, FilterSelectContainer, SelectFiltersButton } from "./FilterPanel.components";



const FilterPanel: FC = () => {
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const ctx = useDataTableContext();
    return <FilterGroupsContainer>
        <div>
            <SelectFiltersButton
                className="clickable"
                onClick={() => { setFiltersOpen(!filtersOpen) }}
            >
                <span>Select Filters</span>
                <ConditionalArrow
                    condition={filtersOpen}
                />
            </SelectFiltersButton>
                <FilterSelectContainer
                    $open={filtersOpen}
                >
                    {
                        ctx?.filterPanelState?.map(filter => {
                            return <FilterGroup
                                {...filter}
                                key={filter.property}
                                headerText={ctx.getHeader(filter.property)?.headerText}
                                onFilterClicked={(clickedFilter) => {
                                    setFiltersOpen(false);
                                    ctx.setSelectedFilters(prev => {
                                        if (prev) {
                                            return prev.concat([clickedFilter]);
                                        } else {
                                            return [clickedFilter]
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