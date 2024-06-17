import { FC, ReactNode } from "react";
import styled from "styled-components";
import TableHeaders from "./TableHeaders";

const TableWrapper = styled.table({
    width: '100%',
});



type TableConditionalProps = {
    children: ReactNode | ReactNode[];
    renderHeaders: boolean;
};

const TableConditional: FC<TableConditionalProps> = ({ children, renderHeaders }) => {
    return <TableWrapper>
        {
            renderHeaders &&
            <thead>
                <TableHeaders />
            </thead>
        }
        <tbody>
            {children}
        </tbody>
    </TableWrapper>
};

export default TableConditional