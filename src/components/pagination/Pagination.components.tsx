import styled from "styled-components";
import { RowBorder } from "../common/classes";

export const PageNumber = styled.div<{ $isCurrentPage?: boolean }>(({ $isCurrentPage }) => {
    return {
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${$isCurrentPage ? 'black' : 'grey'}`
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
`;


export const RowsPerPageTitle = styled.span({
    marginRight: 15
});