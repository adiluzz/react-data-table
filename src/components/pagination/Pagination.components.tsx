import styled from "styled-components";
import { RowBorder, defaultBorder, grayScale500 } from "../common/classes";
import { Clickable } from "../common/classes.const";

export const PageNumber = styled.div<{ $isCurrentPage?: boolean }>`
    ${Clickable}
    height: 45px;
    width: 45px;
    min-width: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: ${({ $isCurrentPage }) => $isCurrentPage ? `1px solid ${grayScale500}` : defaultBorder};
    
    @media (max-width: 768px) {
        height: 36px;
        width: 36px;
        min-width: 36px;
        font-size: 0.875rem;
    }
`;

export const PagesWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
    
    @media (max-width: 768px) {
        gap: 2px;
        justify-content: center;
    }
`;

export const PaginationWrapper = styled.div`
    ${RowBorder}
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 2rem;
    padding-top: 10px;
    padding-bottom: 10px;
    flex-wrap: wrap;
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        padding: 10px;
        
        > div {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
    }
`;


export const RowsPerPageTitle = styled.span({
    marginRight: 15
});

export const PageSizeSelect = styled.select({
    minWidth: 50,
    minHeight: 30,
    borderRadius: 5,
    border: `1px solid ${grayScale500}`,
    paddingLeft: 3,
})