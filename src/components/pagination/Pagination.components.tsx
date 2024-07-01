import styled from "styled-components";
import { RowBorder, defaultBorder, grayScale500 } from "../common/classes";
import { Clickable } from "../common/classes.const";

export const PageNumber = styled.div<{ $isCurrentPage?: boolean }>(({ $isCurrentPage }) => {
    return {
        ...Clickable,
        height: 45,
        width: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: $isCurrentPage ? `1px solid ${grayScale500}` : defaultBorder,
    }
});

export const PagesWrapper = styled.div({
    display: 'flex',
});

export const PaginationWrapper = styled.div`
    ${RowBorder}
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 2rem;
    padding-top: 10px;
    padding-bottom: 10px;
`;


export const RowsPerPageTitle = styled.span({
    marginRight: 15
});

export const PageSizeSelect = styled.select({
    minWidth: 50,
    minHeight: 30,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0)',
    border: `1px solid ${grayScale500}`,
    paddingLeft: 3,
})