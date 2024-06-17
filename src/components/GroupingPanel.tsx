import ClearIcon from '@mui/icons-material/Clear';
import { FC } from "react";
import styled from 'styled-components';
import { useDataTableContext } from "../DataTable.context";
import { Grouping } from "../DataTable.interface";

const GroupingPanelWrapper = styled.div({
    height: '50px',
    width: '100%',
});


const GroupingPanel: FC = <T,>() => {
    const ctx = useDataTableContext<T>();
    const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        const field: Grouping<T> = ev.dataTransfer.getData("text");
        if (field && ctx?.setTableGroupings) {
            ctx?.setTableGroupings((groups) => {
                if (!groups) {
                    const returnValue = [field];
                    return returnValue;
                } else {
                    const returnValue = [...groups];
                    returnValue.push(field);
                    return returnValue;
                }
            });
        }
    };

    const removeFromGroupings = (field: string) => {
        ctx?.setTableGroupings && ctx.setTableGroupings((groups: Grouping<T>[] | undefined) => {
            const foundGroup = groups?.findIndex(val => val === field);
            const newGroups = groups ? [...groups] : []
            if (foundGroup || foundGroup === 0) {
                newGroups.splice(foundGroup, 1);
            }
            return newGroups;
        })
    };

    return <GroupingPanelWrapper
        id='grouping-wrapper'
        onDragOver={(ev => ev.preventDefault())}
        onDrop={onDrop}
    >
        {
            ctx?.tableGroupings?.map(field =>
                <div style={{ display: 'inline-block' }} key={String(field)}>
                    {String(field)}
                    <ClearIcon onClick={() => {
                        removeFromGroupings(String(field));
                    }} />
                </div>
            )
        }
    </GroupingPanelWrapper>

};

export default GroupingPanel;