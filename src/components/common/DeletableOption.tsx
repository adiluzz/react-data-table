import ClearIcon from '@mui/icons-material/Clear';
import { FC } from "react";
import styled from "styled-components";
import { grayScale150 } from './classes';

export const DeletableWrapper = styled.div({
        display: 'flex',
        backgroundColor: grayScale150,
        borderRadius: 10,
        padding: '5px 10px',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: '100%',
        marginRight: 15,
        color: 'black'
});

const TitleWrapper = styled.div({});

export const DeleteButtonWrapper = styled.span({
    display: 'flex'
});


type DeletableOptionProps = {
    title: string;
    onDelete(): void;
}


const DeletableOption: FC<DeletableOptionProps> = ({ title, onDelete }) => {
    return <DeletableWrapper>
        <TitleWrapper>{title}</TitleWrapper>
        <DeleteButtonWrapper>
            <ClearIcon
                onClick={() => {
                    onDelete();
                }}
            />
        </DeleteButtonWrapper>
    </DeletableWrapper>
};

export default DeletableOption;