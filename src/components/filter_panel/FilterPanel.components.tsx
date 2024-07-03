import styled from "styled-components";
import { Collapsible } from "../common/Collapsible";
import { defaultBorder, grayScale100, grayScale200, lightBorder } from "../common/classes";

export const FilterGroupsContainer = styled.div({
    display: 'flex',
    border: defaultBorder,
    alignItems: 'center',
    gap: 15,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
});

export const FilterSelectContainer = styled(Collapsible)(({ $open }) => {
    return {
        width: 250,
        textAlign: 'left',
        position: 'absolute',
        backgroundColor: 'white',
        color: 'black',
        boxShadow: `1px 1px 7px 3px ${grayScale200}`,
        maxHeight: $open ? '80vh' : '0'
    }
});

export const FilterGroupContainer = styled.div({
    maxHeight: 500,
    overflow: 'auto',
    marginBottom: 10,
});


export const FilterGroupWrapper = styled.div({
    borderBottom: lightBorder,
    padding: 10
});


export const FilterGroupHeader = styled.div({
    fontWeight: 600,
    backgroundColor: grayScale100,
    padding: 10
});


export const SelectFiltersButton = styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 240,
    height: 30,
    padding: 5,
    borderRadius: 3,
});


export const ShowMore = styled.div({
    color: '#7788a3',
    textDecoration: 'underline',
    textAlign: 'right',
    padding: 10
});