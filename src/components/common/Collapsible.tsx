import styled from "styled-components";


export const Collapsible = styled.div<{ $open: boolean }>`
    display: block;
    overflow: auto;
    max-height: ${props => props.$open ? "1000px" : "0"};
    transition: ${props => props.$open ? 'max-height 1s ease-out' : 'max-height 1s cubic-bezier(0, 1, 0, 1)'};
`;

