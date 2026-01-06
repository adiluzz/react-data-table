import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Clickable } from "../common/classes.const";

export const TableOverflowContainer = styled(Box)(({ theme }) => ({
    overflowX: 'auto',
    width: '100%',
    '&::-webkit-scrollbar': {
        height: '8px',
    },
    '&::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.grey[100],
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.grey[400],
        borderRadius: '4px',
        '&:hover': {
            backgroundColor: theme.palette.grey[600],
        },
    },
}));

export const TableRowWrapper = TableRow;

export const TableDetail = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
    '&:first-of-type': {
        paddingLeft: theme.spacing(3),
    },
    '&:last-of-type': {
        paddingRight: theme.spacing(3),
    },
}));

export const FullWidthTableDetail = styled(TableCell)({
    padding: 0,
    border: 'none',
});

export const GroupedCell = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.action.hover,
}));

export const GroupedIndentation = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$indentation',
})<{ $indentation: number }>(({ $indentation, theme }) => {
    return {
        width: 50 * $indentation,
        display: 'inline-block',
        height: 10,
        borderLeft: $indentation > 0 ? `2px solid ${theme.palette.primary.light}` : 'none',
        marginLeft: $indentation > 0 ? theme.spacing(1) : 0,
    }
});

export const TableWrapper = styled(Box)({
    width: '100%',
});

export const TableHeaderWrapper = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== '$draggable',
})<{ $draggable: boolean }>(({ $draggable, theme }) => {
    return {
        whiteSpace: 'nowrap',
        cursor: $draggable ? 'grab' : 'default',
        fontWeight: 600,
        backgroundColor: theme.palette.mode === 'dark'
            ? theme.palette.grey[800]
            : theme.palette.grey[50],
        color: theme.palette.text.primary,
        fontSize: '0.875rem',
        padding: theme.spacing(2),
        borderBottom: `2px solid ${theme.palette.divider}`,
        '&:first-of-type': {
            paddingLeft: theme.spacing(3),
        },
        '&:last-of-type': {
            paddingRight: theme.spacing(3),
        },
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
                ? theme.palette.grey[700]
                : theme.palette.grey[100],
        },
        '&:active': {
            cursor: $draggable ? 'grabbing' : 'default',
        },
    }
});

export const TableHeaderIconWrapper = styled(Box)({
    ...Clickable,
    verticalAlign: 'middle',
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: '8px',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
    },
});


export const TableHeaderTextWrapper = styled(Typography)(({ theme }) => ({
    marginRight: theme.spacing(0.5),
    display: 'inline-block',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
}))