import { FC, ReactNode } from "react";
import { TableWrapper } from "./Table.components";
import TableHeaders from "./TableHeaders";


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