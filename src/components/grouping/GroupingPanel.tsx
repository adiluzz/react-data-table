import { FC } from "react";
import DeletableOption from '../common/DeletableOption';
import { useDataTableContext } from "../data_table/DataTable.context";
import { Grouping } from "../data_table/DataTable.interface";
import { GroupingPanelWrapper } from './Grouping.components';


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
                <DeletableOption
                    key={String(field)}
                    title={String(ctx.columns?.find(col => col.key === field)?.headerText)}
                    onDelete={() => {
                        removeFromGroupings(String(field));
                    }} />
            )
        }
        {
            !ctx?.tableGroupings?.length &&
            <div>Drop column headers here to group data</div>
        }
    </GroupingPanelWrapper>

};

export default GroupingPanel;