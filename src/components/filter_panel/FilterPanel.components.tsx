import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Collapsible } from "../common/Collapsible";

export const FilterGroupsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[800]
        : theme.palette.grey[50],
    border: `1px solid ${theme.palette.divider}`,
}));

export const FilterSelectContainer = styled(Collapsible, {
    shouldForwardProp: (prop) => prop !== '$open',
})<{ $open: boolean }>(({ $open, theme }) => {
    return {
        width: 300,
        textAlign: 'left',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        maxHeight: $open ? '80vh' : '0',
        borderRadius: theme.shape.borderRadius,
        overflow: $open ? 'auto' : 'hidden',
        transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
        opacity: $open ? 1 : 0,
        '&::-webkit-scrollbar': {
            width: '8px',
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
    }
});

export const FilterGroupContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));


export const FilterGroupWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$focused',
})<{ $focused?: boolean }>(({ $focused, theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1.5, 2),
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    backgroundColor: $focused ? theme.palette.action.selected : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child': {
        borderBottom: 'none',
    },
}));


export const FilterGroupHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[100],
    padding: theme.spacing(1.5, 2),
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${theme.palette.divider}`,
}));


export const SelectFiltersButton = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 280,
    minHeight: 40,
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
    '&:focus-within': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
    },
}));


export const ShowMore = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    textAlign: 'right',
    padding: theme.spacing(1, 2),
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'color 0.2s ease-in-out',
    '&:hover': {
        color: theme.palette.primary.dark,
        textDecoration: 'underline',
    },
}));