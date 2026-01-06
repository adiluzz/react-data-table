import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const defaultTime = '1s';

export const Collapsible = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$open' && prop !== '$time',
})<{ $open: boolean, $time?: string }>(({ $open, $time }) => ({
    display: 'block',
    overflow: 'auto',
    maxHeight: $open ? "1000px" : "0",
    boxShadow: $open ? "unset" : "none !important",
    transition: $open
        ? `max-height ${$time || defaultTime} ease-out`
        : `max-height ${$time || defaultTime} cubic-bezier(0, 1, 0, 1)`,
}));

