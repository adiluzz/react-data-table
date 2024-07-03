import styled from "styled-components";

const defaultTime = '1s';

export const Collapsible = styled.div<{ $open: boolean, $time?: string }>`
    display: block;
    overflow: auto;
    max-height: ${props => props.$open ? "1000px" : "0"};
    box-shadow: ${props => props.$open ? "unset" : "none !important"};
    transition: ${props => props.$open ? `max-height ${props.$time || defaultTime} ease-out` : `max-height ${props.$time || defaultTime} cubic-bezier(0, 1, 0, 1)`};
`;

