import { Box, InputBase } from "@mui/material";
import { styled } from "@mui/material/styles";

export const SearchBarWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$focused',
})<{ $focused: boolean }>(({ $focused, theme }) => {
    return {
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${$focused ? theme.palette.primary.main : theme.palette.divider}`,
        padding: theme.spacing(1, 1.5),
        borderRadius: theme.shape.borderRadius,
        minHeight: 40,
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.background.paper,
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        boxShadow: $focused ? `0 0 0 2px ${theme.palette.primary.main}20` : 'none',
        '&:hover': {
            borderColor: theme.palette.primary.main,
        },
        // Mobile: appear first (on top) using order
        order: -1,
        // Desktop: appear second (on right) and auto width with constraints
        [theme.breakpoints.up('sm')]: {
            order: 0,
            width: 'auto',
            minWidth: 250,
            maxWidth: 350,
            alignSelf: 'center',
        },
    }
});

export const SearchInput = styled(InputBase)(({ theme }) => ({
    flex: 1,
    fontSize: '0.875rem',
    color: theme.palette.text.primary,
    '& .MuiInputBase-input': {
        padding: 0,
        '&::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 1,
        },
    },
}));