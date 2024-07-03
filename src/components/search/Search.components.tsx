import styled from "styled-components";
import { darkBorder, defaultBorder } from "../common/classes";

export const SearchBarWrapper = styled.div<{ $focused: boolean }>(({ $focused }) => {
    return {
        display: 'flex',
        alignItems: 'center',
        border: $focused ? darkBorder : defaultBorder,
        alignSelf: 'center',
        padding: '10px 6px',
        borderRadius: 6,
        height: 25,
        width: 350,
        justifyContent:'space-between'
    }
});

export const SearchInput = styled.input({
    border: 'none',
    outline: 'none'
});