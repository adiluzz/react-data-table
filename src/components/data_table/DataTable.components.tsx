import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const BottomPanelWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4),
    width: '100%',
    // Mobile: stack vertically with search bar on top
    flexDirection: 'column',
    alignItems: 'stretch',
    // Desktop: horizontal layout
    [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
}));