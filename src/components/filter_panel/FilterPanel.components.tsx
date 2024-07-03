import styled from "styled-components";
import { Collapsible } from "../common/Collapsible";
import { defaultBorder, grayScale200 } from "../common/classes";

export const FilterGroupsContainer = styled.div({
    display: 'flex',
    border: defaultBorder,
    alignItems: 'center',
    gap: 15,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
});

export const FilterSelectContainer = styled(Collapsible)({
    width: 250,
    textAlign: 'left',
    position: 'absolute',
    backgroundColor: 'white'
});

export const FilterGroupContainer = styled.div({
    maxHeight: 500,
    overflow: 'auto',
    marginBottom: 5
});


export const FilterGroupWrapper = styled.div({

});


export const FilterGroupHeader = styled.div({
    fontWeight: 600,
    backgroundColor: grayScale200,
});


export const SelectFiltersButton = styled.div({
    border: defaultBorder,
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 240,
    height: 30,
    padding: 5,
    borderRadius: 3,
});


export const ShowMore = styled.div({
    color: 'blue',
    textDecoration: 'underline'
})