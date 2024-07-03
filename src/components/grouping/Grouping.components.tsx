import styled from "styled-components";
import { defaultBorder } from "../common/classes";

export const GroupingPanelWrapper = styled.div({
    height: '50px',
    width: '100%',
    border: defaultBorder,
    lineHeight: '50px',
    textAlign: 'left',
    paddingLeft: 15,
    borderRadius: 5,
    backgroundColor: 'rgba(245, 245, 245, 0.4)',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
});

export const GroupWrapper = styled.div({
    display: 'flex',
    backgroundColor: '#e3e3e3',
    borderRadius: 10,
    padding: '5px 10px',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: '100%',
    marginRight: 15,
    color: 'black'
});

export const DeleteGroupingButtonWrapper = styled.span({
    display: 'flex'
});