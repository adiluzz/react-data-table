import { FC, useMemo, useState } from "react";
import { FilterGroupContainer, FilterGroupHeader, FilterGroupWrapper, ShowMore } from "./FilterPanel.components";
import { Filter, FilterResult } from "./FilterPanel.interface";

type FilterGroupProps = Filter & {
    onFilterClicked?(filter: FilterResult): void;
    headerText?: string;
}

const FilterGroup: FC<FilterGroupProps> = ({ property, values, onFilterClicked, headerText }) => {
    const [rowsToDisplay, setRowsToDisplay] = useState<number>(5);
    const canShowMore = useMemo(() => {
        return rowsToDisplay < values.length;
    }, [rowsToDisplay, values.length])
    return <FilterGroupContainer>
        <FilterGroupHeader>{headerText || property}</FilterGroupHeader>
        {
            values.slice(0, rowsToDisplay).map(val =>
                <FilterGroupWrapper
                    onClick={() => {
                        if (onFilterClicked) {
                            onFilterClicked({
                                property,
                                value: val.value
                            });
                        }
                    }}
                    key={val.value}
                >{val.value} - {val.count}</FilterGroupWrapper>
            )
        }
        {
            canShowMore &&
            <ShowMore
                onClick={() => { setRowsToDisplay(rowsToDisplay + 5) }}
                className="clickable"
            >
                Show More
            </ShowMore>
        }
    </FilterGroupContainer>
};

export default FilterGroup;