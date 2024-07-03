import styled from "styled-components";
import { darkBorder, defaultBorder } from "../common/classes";

export const SearchBarWrapper = styled.div<{ $focused: boolean }>(({ $focused }) => {
    return {
        display: 'flex',
        alignItems: 'center',
        border: $focused ? darkBorder : defaultBorder,
        alignSelf: 'center',
        padding: 6,
        borderRadius: 6
    }
});

export const SearchInput = styled.input({
    border: 'none',
    outline: 'none'
});