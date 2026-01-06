import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const GroupingPanelWrapper = styled(Box)(({ theme }) => ({
    minHeight: 56,
    width: '100%',
    border: `1px dashed ${theme.palette.divider}`,
    textAlign: 'left',
    padding: theme.spacing(1.5, 2),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.02)',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: theme.spacing(1),
    transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)',
        borderColor: theme.palette.primary.main,
    },
    '&.drag-over': {
        backgroundColor: theme.palette.action.selected,
        borderColor: theme.palette.primary.main,
        borderStyle: 'solid',
    },
}));

export const GroupingPlaceholder = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    fontStyle: 'italic',
    width: '100%',
    textAlign: 'center',
    padding: theme.spacing(1),
}));

export const GroupWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    backgroundColor: theme.palette.mode === 'dark'
        ? theme.palette.grey[700]
        : theme.palette.grey[200],
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5, 1),
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: '100%',
    marginRight: theme.spacing(1),
    color: theme.palette.text.primary,
}));

export const DeleteGroupingButtonWrapper = styled(Box)({
    display: 'flex'
});