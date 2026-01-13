import { Box, TableCell, TableRow, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Clickable } from "../common/classes.const";

export const TableOverflowContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$isNested',
})<{ $isNested?: boolean }>(({ $isNested, theme }) => ({
    overflowX: $isNested ? 'visible' : 'auto',
    overflowY: $isNested ? 'visible' : 'auto',
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

export const TableDetail = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== '$width' && prop !== '$isCheckbox',
})<{ $width?: number; $isCheckbox?: boolean }>(({ $width, $isCheckbox, theme }) => ({
    ...($isCheckbox ? {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: 0,
    } : {
        padding: theme.spacing(1.5, 2),
    }),
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
    // Keep content on one line to determine column width based on content
    whiteSpace: 'nowrap',
    overflow: $isCheckbox ? 'visible' : 'hidden',
    textOverflow: 'ellipsis',
    justifyContent: $isCheckbox ? 'center' : 'flex-start',
    verticalAlign: 'middle',
    // When width is specified, use it; otherwise let content determine width
    ...($width !== undefined ? {
        width: `${$width}px`,
        minWidth: `${$width}px`,
        maxWidth: `${$width}px`,
    } : {
        width: 'auto',
        minWidth: 'max-content',
    }),
    ...(!$isCheckbox && {
        '&:first-of-type': {
            paddingLeft: theme.spacing(3),
        },
        '&:last-of-type': {
            paddingRight: theme.spacing(3),
        },
    }),
    // Remove left padding from cell immediately after checkbox
    '&.checkbox-cell + .MuiTableCell-root': {
        paddingLeft: '0 !important',
    },
}));

export const FullWidthTableDetail = styled(TableCell)(({ theme }) => ({
    padding: 0,
    border: 'none',
    borderLeft: 'none !important',
    borderRight: 'none !important',
    borderTop: 'none !important',
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const GroupedCell = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    display: 'flex',
    alignItems: 'center',
    borderBottom: 'none',
    backgroundColor: 'transparent',
    minHeight: '48px',
    boxSizing: 'border-box',
}));

export const GroupedIndentation = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$indentation',
})<{ $indentation: number }>(({ $indentation, theme }) => {
    return {
        width: 50 * $indentation,
        display: 'inline-block',
        height: 10,
        borderLeft: $indentation > 0 ? `1px solid ${theme.palette.divider}` : 'none',
        marginLeft: $indentation > 0 ? theme.spacing(1) : 0,
    }
});

export const TableWrapper = styled(Box)({
    width: '100%',
});

export const TableHeaderWrapper = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== '$draggable' && prop !== '$width' && prop !== '$isCheckbox',
})<{ $draggable: boolean; $width?: number; $isCheckbox?: boolean }>(({ $draggable, $width, $isCheckbox, theme }) => {
    return {
        // Keep header on one line so width is determined by longest content (header or cell)
        whiteSpace: 'nowrap',
        cursor: $draggable ? 'grab' : 'default',
        fontWeight: 600,
        backgroundColor: theme.palette.mode === 'dark'
            ? theme.palette.grey[800]
            : theme.palette.grey[50],
        color: theme.palette.text.primary,
        fontSize: '0.875rem',
        ...($isCheckbox ? {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(1),
            paddingRight: 0,
        } : {
            padding: theme.spacing(2),
        }),
        borderBottom: `2px solid ${theme.palette.divider}`,
        verticalAlign: 'middle',
        justifyContent: $isCheckbox ? 'center' : 'flex-start',
        // When width is specified, use it; otherwise let content determine width
        ...($width !== undefined ? {
            width: `${$width}px`,
            minWidth: `${$width}px`,
            maxWidth: `${$width}px`,
        } : {
            width: 'auto',
            minWidth: 'max-content',
       }),
        ...(!$isCheckbox && {
            '&:first-of-type': {
                paddingLeft: theme.spacing(3),
            },
            '&:last-of-type': {
                paddingRight: theme.spacing(3),
            },
        }),
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