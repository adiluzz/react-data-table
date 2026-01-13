import { Box, Typography } from "@mui/material";
import { FC, useMemo, useState } from "react";
import { FilterGroupContainer, FilterGroupHeader, FilterGroupWrapper, ShowMore } from "./FilterPanel.components";
import { avoidCloseFiltersMenu } from "./FilterPanel.const";
import { Filter, FilterResult } from "./FilterPanel.interface";

type FilterGroupProps = Filter & {
    onFilterClicked?(filter: FilterResult): void;
    headerText?: string;
    groupIndex: number;
    focusedIndex: number;
}

const FilterGroup: FC<FilterGroupProps> = ({ property, values, onFilterClicked, headerText, groupIndex, focusedIndex }) => {
    const [rowsToDisplay, setRowsToDisplay] = useState<number>(5);
    const canShowMore = useMemo(() => rowsToDisplay < values.length, [rowsToDisplay, values.length]);
    // groupIndex is used for keyboard navigation tracking via data-filter-group attribute
    return <FilterGroupContainer data-filter-group data-group-index={groupIndex}>
        <FilterGroupHeader>{headerText || property}</FilterGroupHeader>
        {
            values.slice(0, rowsToDisplay).map((val, optionIndex) =>
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
                    className="clickable"
                    data-filter-option
                    $focused={focusedIndex === optionIndex}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'text.primary' }}>
                            {val.value}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                fontWeight: 500,
                                ml: 2,
                            }}
                        >
                            ({val.count})
                        </Typography>
                    </Box>
                </FilterGroupWrapper>
            )
        }
        {
            canShowMore &&
            <ShowMore
                onClick={() => {
                    setRowsToDisplay(rowsToDisplay + 5);
                }}
                className={`clickable ${avoidCloseFiltersMenu}`}
            >
                Show More
            </ShowMore>
        }
    </FilterGroupContainer>
};

export default FilterGroup;