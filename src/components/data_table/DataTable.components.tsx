import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const BottomPanelWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4),
    flexWrap: 'nowrap',
    alignItems: 'center',
    width: '100%',
}));