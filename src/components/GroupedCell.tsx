import { FC } from "react";

type GroupedCellProps = {
    value: string;
    colspan: number;
    depth: number;
}

const GroupedCell: FC<GroupedCellProps> = ({ value, colspan, depth }) => {
    return <tr>
        <td colSpan={colspan} style={{ textAlign: 'left', display:'flex' }}>
            {
                new Array(depth).fill(' ').map((_filled, i) =>
                    <div key={i} style={{ width: '50px' }}></div>
                )
            }
            <div>{value}</div>
        </td>
    </tr>
};

export default GroupedCell;