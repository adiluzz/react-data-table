import { FC, useState } from "react";
import DeletableOption from '../common/DeletableOption';
import { useDataTableContext } from "../data_table/DataTable.context";
import { Grouping } from "../data_table/DataTable.interface";
import { GroupingPanelWrapper, GroupingPlaceholder } from './Grouping.components';


const GroupingPanel: FC = <T,>() => {
    const ctx = useDataTableContext<T>();
    const [isDragOver, setIsDragOver] = useState(false);

    const onDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        setIsDragOver(false);
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
        onDragOver={(ev) => {
            ev.preventDefault();
            setIsDragOver(true);
        }}
        onDragLeave={(ev) => {
            ev.preventDefault();
            setIsDragOver(false);
        }}
        onDrop={onDrop}
        className={isDragOver ? 'drag-over' : ''}
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
            <GroupingPlaceholder>
                Drop column headers here to group data
            </GroupingPlaceholder>
        }
    </GroupingPanelWrapper>

};

export default GroupingPanel;