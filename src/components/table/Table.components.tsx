import styled from "styled-components";
import { RowBorder } from "../common/classes";

export const TableOverflowContainer = styled.div({
    overflowX: 'auto',
});

export const TableRowWrapper = styled.tr`
    min-height:0px;
`;

export const TableDetail = styled.td`
    ${RowBorder}
    padding: 10px;
`

export const FullWidthTableDetail = styled.td`
    padding: 0px;
    border: none;
`;

export const GroupedCell = styled.div`
    ${RowBorder}
    padding: 10px;
    display:flex;
`;

export const GroupedIndentation = styled.span<{ $indentation: number }>(({ $indentation }) => {
    return {
        width: 50 * $indentation,
        display: 'inline-block',
        height: 10
    }
});

export const TableWrapper = styled.table({
    width: '100%',
    borderCollapse: 'collapse'
});

export const TableHeaderWrapper = styled.th({
    whiteSpace: 'nowrap'
});
